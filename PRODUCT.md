# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain HTML, CSS, and JavaScript, confirmed by the user. No build step or server-side runtime. The user delegated visual design.

## Product Purpose

A complete classic 2048 game that works on mobile and desktop and can be hosted on GitHub Pages.

## Capabilities and Constraints

- Classic 4 by 4 board; a tile merges once per move toward the movement direction.
- A valid move spawns one tile: 90% 2, 10% 4. Invalid moves do not spawn.
- Score tracking, New Game, win at 2048, and game-over detection.
- Full touch start/move/end swipe controls, preventing scrolling on the game board, and keyboard controls.
- Responsive layout and distinct colors for powers of two through 2048.
- A header light/dark toggle replaces the How to play link; instructions remain below the board. Theme choice persists independently of game progress, initially following the system preference.
- Fluid tile slides, merges, and spawns retain tile identity through consecutive moves and respect reduced motion.
- Save the completed project in D:\Coding\yur-iko\2048-game-web, configure Git locally, and leave account-level administration to the user.

## Implementation Assumptions

- English interface; casual solo play in a browser.
- Browser-local saved progress and best score are useful enhancements; New Game resets the current game and preserves the best score.
- Players may continue after reaching 2048.
