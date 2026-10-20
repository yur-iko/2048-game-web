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
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const formatter = new Intl.NumberFormat('en');
  let state;
  let best = 0;
  let tiles = new Map();
  let animationTimer;
  let busy = false;
  let pendingDirection = null;
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

  function render(spawned = null, merged = []) {
    tileLayer.replaceChildren();
    tiles = new Map();
    const mergedKeys = new Set(merged.map(position => position.join(',')));
    state.board.forEach((row, r) => row.forEach((value, c) => {
      if (!value) return;
      const tile = document.createElement('div');
      const digits = String(value).length;
      tile.className = 'tile';
      if (value > 2048) tile.classList.add('tile-super');
      if (digits === 3) tile.classList.add('tile-three');
      if (digits === 4) tile.classList.add('tile-four');
      if (digits === 5) tile.classList.add('tile-five');
      if (digits > 5) tile.classList.add('tile-long');
      if (spawned && spawned[0] === r && spawned[1] === c) tile.classList.add('spawned');
      if (mergedKeys.has([r, c].join(','))) tile.classList.add('merged');
      tile.dataset.value = value;
      placeTile(tile, [r, c]);
      const inner = document.createElement('span');
      inner.className = 'tile-inner';
      inner.textContent = value;
      tile.append(inner);
      tileLayer.append(tile);
      tiles.set([r, c].join(','), tile);
    }));

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

  function move(direction) {
    if (!overlay.hidden) return;
    if (busy) {
      pendingDirection = direction;
      return;
    }
    const result = game.move(state.board, direction);
    if (!result.moved) return;

    busy = true;
    const spawned = game.spawn(result.board);
    state.board = spawned.board;
    state.score += result.gain;
    state.won = state.won || game.hasWon(state.board);
    best = Math.max(best, state.score);
    persist();

    const mergedKeys = new Set(result.merged.map(position => position.join(',')));
    result.transitions.forEach(transition => {
      const tile = tiles.get(transition.from.join(','));
      if (tile) {
        if (mergedKeys.has(transition.to.join(','))) tile.classList.add('merging');
        placeTile(tile, transition.to);
      }
    });

    animationTimer = window.setTimeout(() => {
      render(spawned.position, result.merged);
      if (overlay.hidden) announcer.textContent = `Moved ${direction}. ${result.gain ? `Merged for ${result.gain} points. ` : ''}Score ${state.score}. Highest tile ${game.highest(state.board)}.`;
      if (result.gain) {
        gainElement.textContent = `+${formatter.format(result.gain)}`;
        gainElement.classList.remove('show');
        void gainElement.offsetWidth;
        gainElement.classList.add('show');
      }
      busy = false;
      const next = pendingDirection;
      pendingDirection = null;
      if (next) move(next);
    }, reducedMotion.matches ? 0 : 145);
  }

  function restart() {
    window.clearTimeout(animationTimer);
    busy = false;
    pendingDirection = null;
    gesture = null;
    state = { board: game.newGame(), score: 0, won: false, continued: false };
    gainElement.classList.remove('show');
    persist();
    render();
    announcer.textContent = 'New game started. Two tiles on the board. Score zero.';
    boardElement.focus({ preventScroll: true });
  }

  document.querySelector('#new-game').addEventListener('click', restart);
  retryButton.addEventListener('click', restart);
  continueButton.addEventListener('click', () => {
    state.continued = true;
    persist();
    render();
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
