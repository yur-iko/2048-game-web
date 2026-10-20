(function (root) {
  'use strict';

  const SIZE = 4;
  const DIRECTIONS = ['left', 'right', 'up', 'down'];
  const emptyBoard = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  const cloneBoard = board => board.map(row => row.slice());

  function coordinates(direction, line, offset) {
    if (direction === 'left') return [line, offset];
    if (direction === 'right') return [line, SIZE - 1 - offset];
    if (direction === 'up') return [offset, line];
    return [SIZE - 1 - offset, line];
  }

  function move(board, direction) {
    if (!DIRECTIONS.includes(direction)) throw new Error('Unknown move direction');
    const next = emptyBoard();
    const transitions = [];
    const merged = [];
    let gain = 0;

    for (let line = 0; line < SIZE; line++) {
      const values = [];
      for (let offset = 0; offset < SIZE; offset++) {
        const [row, col] = coordinates(direction, line, offset);
        if (board[row][col]) values.push({ value: board[row][col], from: [row, col] });
      }

      let destination = 0;
      for (let index = 0; index < values.length; index++) {
        const current = values[index];
        const to = coordinates(direction, line, destination++);
        const partner = values[index + 1];
        let value = current.value;
        transitions.push({ from: current.from, to });

        // Consume the pair together so a newly merged tile cannot merge again.
        if (partner && partner.value === value) {
          value *= 2;
          gain += value;
          transitions.push({ from: partner.from, to });
          merged.push(to);
          index++;
        }
        next[to[0]][to[1]] = value;
      }
    }

    const moved = board.some((row, r) => row.some((value, c) => value !== next[r][c]));
    return { board: next, gain, moved, transitions, merged };
  }

  function spawn(board, random = Math.random) {
    const spaces = [];
    board.forEach((row, r) => row.forEach((value, c) => {
      if (value === 0) spaces.push([r, c]);
    }));
    const next = cloneBoard(board);
    if (!spaces.length) return { board: next, position: null };
    const position = spaces[Math.min(spaces.length - 1, Math.floor(random() * spaces.length))];
    next[position[0]][position[1]] = random() < 0.9 ? 2 : 4;
    return { board: next, position };
  }

  function canMove(board) {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const value = board[row][col];
        if (value === 0) return true;
        if (col < SIZE - 1 && value === board[row][col + 1]) return true;
        if (row < SIZE - 1 && value === board[row + 1][col]) return true;
      }
    }
    return false;
  }

  const highest = board => Math.max(...board.flat());
  const hasWon = board => highest(board) >= 2048;

  function newGame(random = Math.random) {
    return spawn(spawn(emptyBoard(), random).board, random).board;
  }

  function swipeDirection(start, end, threshold = 24) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return null;
    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
    return dy > 0 ? 'down' : 'up';
  }

  function validBoard(board) {
    return Array.isArray(board) && board.length === SIZE && board.every(row =>
      Array.isArray(row) && row.length === SIZE && row.every(value =>
        value === 0 || (Number.isSafeInteger(value) && value >= 2 && Number.isInteger(Math.log2(value)))
      )
    ) && highest(board) >= 2;
  }

  const api = { SIZE, DIRECTIONS, emptyBoard, cloneBoard, move, spawn, canMove, highest, hasWon, newGame, swipeDirection, validBoard };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Game2048 = Object.freeze(api);
})(typeof globalThis === 'undefined' ? this : globalThis);
