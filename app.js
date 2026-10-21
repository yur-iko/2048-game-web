(() => {
  'use strict';

  const game = window.Game2048;
  const storageKey = 'good-things-2048-v1';
  const bestKey = 'good-things-2048-best';
  const boardElement = document.querySelector('#board');
  const tileLayer = document.querySelector('#tiles');
  const scoreElement = document.querySelector('#score');
  const bestElement = document.querySelector('#best');
  const gainElement = document.querySelector('#score-gain');
  const overlay = document.querySelector('#game-overlay');
  const continueButton = document.querySelector('#keep-playing');
  const retryButton = document.querySelector('#try-again');
  const announcer = document.querySelector('#announcer');
  const formatter = new Intl.NumberFormat('en');
  let state;
  let best = 0;
  let tiles = new Map();
  const animations = new Set();
  const slideDuration = 180;
  let moveVersion = 0;
  let busy = false;
  const pendingDirections = [];
  let gesture = null;
  let storageAvailable = true;

  function storageFailure() {
    storageAvailable = false;
    document.querySelector('#storage-notice').hidden = false;
  }

  function persist() {
    if (!storageAvailable) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, ...state }));
      localStorage.setItem(bestKey, String(best));
    } catch {
      storageFailure();
    }
  }

  function restore() {
    let saved;
    try {
      const storedBest = Number(localStorage.getItem(bestKey));
      if (Number.isSafeInteger(storedBest) && storedBest >= 0) best = storedBest;
      saved = JSON.parse(localStorage.getItem(storageKey));
    } catch (error) {
      if (!(error instanceof SyntaxError)) storageFailure();
    }
    if (saved && saved.version === 1 && game.validBoard(saved.board) && Number.isSafeInteger(saved.score) && saved.score >= 0) {
      const won = game.hasWon(saved.board);
      state = { board: saved.board, score: saved.score, won, continued: won && saved.continued === true };
      best = Math.max(best, state.score);
    } else {
      state = { board: game.newGame(), score: 0, won: false, continued: false };
    }
  }

  function placeTile(element, position) {
    element.style.setProperty('--row', position[0]);
    element.style.setProperty('--col', position[1]);
  }

  function animate(element, frames, duration) {
    if (!element.animate) return null;
    const animation = element.animate(frames, { duration, easing: 'cubic-bezier(.22,.8,.25,1)' });
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    return animation;
  }

  function updateTile(tile, value) {
    const digits = String(value).length;
    tile.dataset.value = value;
    tile.classList.toggle('tile-super', value > 2048);
    tile.classList.toggle('tile-three', digits === 3);
    tile.classList.toggle('tile-four', digits === 4);
    tile.classList.toggle('tile-five', digits === 5);
    tile.classList.toggle('tile-long', digits > 5);
    tile.firstElementChild.textContent = value;
  }

  function createTile(value, position) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    const inner = document.createElement('span');
    inner.className = 'tile-inner';
    tile.append(inner);
    updateTile(tile, value);
    placeTile(tile, position);
    tileLayer.append(tile);
    return tile;
  }

  function appear(tile) {
    animate(tile.firstElementChild, [
      { transform: 'scale(.55)', opacity: .25 },
      { transform: 'scale(1)', opacity: 1 }
    ], 200);
  }

  function render() {
    tileLayer.replaceChildren();
    tiles = new Map();
    state.board.forEach((row, r) => row.forEach((value, c) => {
      if (!value) return;
      const tile = createTile(value, [r, c]);
      tiles.set([r, c].join(','), tile);
    }));
    updateInterface();
  }

  function updateInterface() {
    const tbody = document.querySelector('#accessible-board tbody');
    tbody.replaceChildren();
    state.board.forEach(row => {
      const tr = document.createElement('tr');
      row.forEach(value => {
        const td = document.createElement('td');
        td.textContent = value || 'empty';
        tr.append(td);
      });
      tbody.append(tr);
    });
    scoreElement.textContent = formatter.format(state.score);
    bestElement.textContent = formatter.format(best);
    scoreElement.classList.toggle('compact', state.score >= 100000);
    bestElement.classList.toggle('compact', best >= 100000);
    updateOverlay();
  }

  function updateOverlay() {
    const win = state.won && !state.continued;
    const over = !game.canMove(state.board);
    const wasHidden = overlay.hidden;
    const previousKind = overlay.dataset.kind;
    overlay.dataset.kind = win ? 'win' : 'over';
    overlay.hidden = !win && !over;
    continueButton.hidden = !win;
    retryButton.textContent = win ? 'New Game' : 'Play again';
    if (overlay.hidden) return;
    document.querySelector('#overlay-title').textContent = win ? 'You made it.' : 'Every move counts.';
    document.querySelector('#overlay-message').textContent = win ? '2048 is yours. See how far you can go.' : `No moves left. Your score: ${formatter.format(state.score)}.`;
    document.querySelector('#overlay-tile').textContent = win ? '2048' : game.highest(state.board);
    if (wasHidden || previousKind !== overlay.dataset.kind) {
      announcer.textContent = win ? 'You reached 2048! Keep playing or start a new game.' : `Game over. Final score ${state.score}. Start a new game to try again.`;
      (win ? continueButton : retryButton).focus({ preventScroll: true });
    }
  }

  async function move(direction) {
    if (!overlay.hidden) return;
    if (busy) {
      if (pendingDirections.length < 3) pendingDirections.push(direction);
      return;
    }
    const result = game.move(state.board, direction);
    if (!result.moved) return;

    busy = true;
    const version = ++moveVersion;
    const spawned = game.spawn(result.board);
    state.board = spawned.board;
    state.score += result.gain;
    state.won = state.won || game.hasWon(state.board);
    best = Math.max(best, state.score);
    persist();

    const mergedKeys = new Set(result.merged.map(position => position.join(',')));
    const nextTiles = new Map();
    const consumed = [];
    const motions = [];
    const origins = new Map([...tiles.values()].map(tile => [tile, getComputedStyle(tile).transform]));
    result.transitions.forEach(transition => {
      const tile = tiles.get(transition.from.join(','));
      const destination = transition.to.join(',');
      if (nextTiles.has(destination)) consumed.push(tile);
      else nextTiles.set(destination, tile);
      if (mergedKeys.has(destination)) tile.classList.add('merging');
      placeTile(tile, transition.to);
    });

    // Explicit endpoints also animate consecutive moves before a browser paint.
    tiles.forEach(tile => {
      const from = origins.get(tile);
      const to = getComputedStyle(tile).transform;
      if (from === to) return;
      tile.classList.add('sliding');
      const animation = animate(tile, [{ transform: from }, { transform: to }], slideDuration);
      if (animation) motions.push(animation.finished.catch(() => {}));
    });
    await Promise.all(motions);
    if (version !== moveVersion) return;

    consumed.forEach(tile => tile.remove());
    nextTiles.forEach((tile, position) => {
      const [row, col] = position.split(',').map(Number);
      tile.classList.remove('merging', 'sliding');
      updateTile(tile, state.board[row][col]);
      if (mergedKeys.has(position)) {
        (tile.firstElementChild.getAnimations?.() || []).forEach(animation => animation.cancel());
        animate(tile.firstElementChild, [
          { transform: 'scale(1)' },
          { transform: 'scale(1.13)', offset: .4 },
          { transform: 'scale(1)' }
        ], 210);
      }
    });
    const position = spawned.position;
    const tile = createTile(state.board[position[0]][position[1]], position);
    nextTiles.set(position.join(','), tile);
    appear(tile);
    tiles = nextTiles;
    updateInterface();
    if (overlay.hidden) announcer.textContent = `Moved ${direction}. ${result.gain ? `Merged for ${result.gain} points. ` : ''}Score ${state.score}. Highest tile ${game.highest(state.board)}.`;
    if (result.gain) {
      gainElement.textContent = `+${formatter.format(result.gain)}`;
      gainElement.classList.remove('show');
      void gainElement.offsetWidth;
      gainElement.classList.add('show');
    }
    busy = false;
    if (!overlay.hidden) pendingDirections.length = 0;
    else if (pendingDirections.length) move(pendingDirections.shift());
  }

  function restart() {
    moveVersion++;
    animations.forEach(animation => animation.cancel());
    animations.clear();
    busy = false;
    pendingDirections.length = 0;
    gesture = null;
    state = { board: game.newGame(), score: 0, won: false, continued: false };
    gainElement.classList.remove('show');
    persist();
    render();
    tiles.forEach(appear);
    announcer.textContent = 'New game started. Two tiles on the board. Score zero.';
    boardElement.focus({ preventScroll: true });
  }

  document.querySelector('#new-game').addEventListener('click', restart);
  retryButton.addEventListener('click', restart);
  continueButton.addEventListener('click', () => {
    state.continued = true;
    persist();
    updateInterface();
    if (overlay.hidden) boardElement.focus({ preventScroll: true });
  });
  document.querySelectorAll('[data-direction]').forEach(button => {
    button.addEventListener('click', () => move(button.dataset.direction));
  });

  const keyDirections = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down' };
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    const direction = keyDirections[event.key];
    if (!direction || !overlay.hidden) return;
    event.preventDefault();
    move(direction);
  });

  boardElement.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) {
      gesture = null;
      return;
    }
    const touch = event.touches[0];
    gesture = { id: touch.identifier, x: touch.clientX, y: touch.clientY };
  }, { passive: true });

  boardElement.addEventListener('touchmove', event => {
    if (!gesture) return;
    if (event.touches.length !== 1) {
      gesture = null;
      return;
    }
    if (event.cancelable) event.preventDefault();
  }, { passive: false });

  boardElement.addEventListener('touchend', event => {
    if (!gesture) return;
    const touch = Array.from(event.changedTouches).find(item => item.identifier === gesture.id);
    if (!touch) return;
    const direction = game.swipeDirection(gesture, { x: touch.clientX, y: touch.clientY }, Math.max(24, boardElement.clientWidth * .06));
    gesture = null;
    if (direction) move(direction);
  }, { passive: true });

  boardElement.addEventListener('touchcancel', () => { gesture = null; }, { passive: true });
  window.addEventListener('blur', () => { gesture = null; });
  restore();
  render();
  persist();
})();
