const test = require('node:test');
const assert = require('node:assert/strict');
const game = require('../engine.js');

function boardWith(row) {
  const board = game.emptyBoard();
  board[0] = row;
  return board;
}

test('merges pairs once, including the classic 2 2 4 chain trap', () => {
  const result = game.move(boardWith([2, 2, 4, 0]), 'left');
  assert.deepEqual(result.board[0], [4, 4, 0, 0]);
  assert.equal(result.gain, 4);
  assert.equal(result.merged.length, 1);
});

test('four identical tiles form two separate pairs', () => {
  const result = game.move(boardWith([2, 2, 2, 2]), 'left');
  assert.deepEqual(result.board[0], [4, 4, 0, 0]);
  assert.equal(result.gain, 8);
});

test('movement direction determines which pair merges first', () => {
  assert.deepEqual(game.move(boardWith([2, 2, 2, 0]), 'right').board[0], [0, 0, 2, 4]);
  assert.deepEqual(game.move(boardWith([4, 4, 8, 8]), 'right').board[0], [0, 0, 8, 16]);
});

test('gaps collapse before merging', () => {
  assert.deepEqual(game.move(boardWith([2, 0, 2, 4]), 'left').board[0], [4, 4, 0, 0]);
});

test('up and down use the same directional merge rules', () => {
  const board = [[2, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0]];
  assert.deepEqual(game.move(board, 'up').board.map(row => row[0]), [4, 2, 0, 0]);
  assert.deepEqual(game.move(board, 'down').board.map(row => row[0]), [0, 0, 2, 4]);
});

test('no-op movement is invalid and leaves its input intact', () => {
  const board = boardWith([2, 4, 0, 0]);
  const before = structuredClone(board);
  const result = game.move(board, 'left');
  assert.equal(result.moved, false);
  assert.equal(result.gain, 0);
  assert.deepEqual(board, before);
  assert.throws(() => game.move(board, 'diagonal'));
});

test('spawn places exactly one tile into an empty cell without mutation', () => {
  const board = boardWith([2, 4, 0, 0]);
  const sequence = [0, 0.899999];
  const result = game.spawn(board, () => sequence.shift());
  assert.deepEqual(result.position, [0, 2]);
  assert.equal(result.board[0][2], 2);
  assert.equal(board[0][2], 0);
  assert.equal(result.board.flat().filter(Boolean).length, 3);
});

test('spawn uses the 90% boundary exactly, and supports the final empty cell', () => {
  const sequence = [0.99999, 0.9];
  const result = game.spawn(game.emptyBoard(), () => sequence.shift());
  assert.deepEqual(result.position, [3, 3]);
  assert.equal(result.board[3][3], 4);
});

test('controlled uniform samples yield exactly 90 twos and 10 fours', () => {
  let twos = 0;
  for (let i = 0; i < 100; i++) {
    const samples = [0, i / 100];
    if (game.spawn(game.emptyBoard(), () => samples.shift()).board[0][0] === 2) twos++;
  }
  assert.equal(twos, 90);
});

test('a full board can be live with a horizontal or vertical pair', () => {
  const dead = [[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2]];
  assert.equal(game.canMove(dead), false);
  const horizontal = structuredClone(dead);
  horizontal[0][1] = 2;
  assert.equal(game.canMove(horizontal), true);
  const vertical = structuredClone(dead);
  vertical[1][0] = 2;
  assert.equal(game.canMove(vertical), true);
  dead[3][3] = 0;
  assert.equal(game.canMove(dead), true);
});

test('full-board spawn is harmless', () => {
  const board = Array.from({ length: 4 }, () => [2, 4, 8, 16]);
  assert.deepEqual(game.spawn(board), { board, position: null });
});

test('win is detected at 2048 and beyond', () => {
  assert.equal(game.hasWon(boardWith([1024, 1024, 0, 0])), false);
  const result = game.move(boardWith([1024, 1024, 0, 0]), 'left');
  assert.equal(game.hasWon(result.board), true);
  assert.equal(result.gain, 2048);
  assert.equal(game.hasWon(boardWith([4096, 0, 0, 0])), true);
});

test('a fresh game starts with exactly two valid tiles', () => {
  const board = game.newGame(() => 0);
  assert.equal(board.flat().filter(Boolean).length, 2);
  assert.ok(board.flat().every(value => [0, 2, 4].includes(value)));
});

test('swipes distinguish all directions, tolerate diagonals, and reject taps', () => {
  const start = { x: 50, y: 50 };
  assert.equal(game.swipeDirection(start, { x: 90, y: 60 }), 'right');
  assert.equal(game.swipeDirection(start, { x: 10, y: 40 }), 'left');
  assert.equal(game.swipeDirection(start, { x: 60, y: 10 }), 'up');
  assert.equal(game.swipeDirection(start, { x: 40, y: 90 }), 'down');
  assert.equal(game.swipeDirection(start, { x: 60, y: 55 }), null);
  assert.equal(game.swipeDirection(start, { x: 74, y: 50 }), 'right');
});

test('persistence validation rejects malformed, unsafe, and empty data', () => {
  assert.equal(game.validBoard(boardWith([2, 4, 8, 16])), true);
  for (const bad of [null, [], game.emptyBoard(), [[2]], boardWith([3, 0, 0, 0]), boardWith([-2, 0, 0, 0]), boardWith([2 ** 53, 0, 0, 0])]) {
    assert.equal(game.validBoard(bad), false);
  }
});

test('all 625 possible small rows satisfy an independent merge oracle in all directions', () => {
  function oracle(values) {
    const stack = [];
    let score = 0;
    for (const value of values.filter(Boolean)) {
      const last = stack[stack.length - 1];
      if (last && !last.used && last.value === value) {
        last.value *= 2;
        last.used = true;
        score += last.value;
      } else stack.push({ value, used: false });
    }
    return { line: [...stack.map(item => item.value), ...Array(4 - stack.length).fill(0)], score };
  }
  const values = [0, 2, 4, 8, 16];
  for (let a of values) for (let b of values) for (let c of values) for (let d of values) {
    const line = [a, b, c, d];
    for (const direction of game.DIRECTIONS) {
      const board = game.emptyBoard();
      const reverse = direction === 'right' || direction === 'down';
      line.forEach((value, i) => {
        if (direction === 'left' || direction === 'right') board[0][i] = value;
        else board[i][0] = value;
      });
      const expected = oracle(reverse ? line.slice().reverse() : line);
      if (reverse) expected.line.reverse();
      const actual = game.move(board, direction);
      const actualLine = direction === 'left' || direction === 'right' ? actual.board[0] : actual.board.map(row => row[0]);
      assert.deepEqual(actualLine, expected.line);
      assert.equal(actual.gain, expected.score);
      assert.equal(actual.board.flat().reduce((sum, n) => sum + n, 0), line.reduce((sum, n) => sum + n, 0));
    }
  }
});
