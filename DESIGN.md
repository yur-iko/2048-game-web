---
name: "2048 - Good things add up."
description: "A printed color-study swatch book for a classic number puzzle."
colors:
  paper: "#f5f3eb"
  ink: "#252a25"
  muted: "#65695e"
  line: "#d9d9cc"
  citrus: "#deee90"
  board: "#d7dacd"
  cell: "#e8eade"
  focus-olive: "#566b24"
  score-surface: "#e8e9de"
  best-surface: "#e1e8ca"
  score-label: "#51594a"
  button-text: "#fffdf6"
  button-hover: "#424c39"
  direction-border: "#ccd1bf"
  direction-ink: "#515d43"
  secondary-surface: "#e0e5d3"
  secondary-hover: "#ccd8b0"
  overlay-paper: "rgb(245 243 235 / 96%)"
  tile-2: "#e4e8da"
  tile-4: "#cbd9ad"
  tile-8: "#deeb91"
  tile-16: "#efd982"
  tile-32: "#edbb7c"
  tile-64: "#e99b7c"
  tile-128: "#d98781"
  tile-256: "#c8abd1"
  tile-512: "#adbde3"
  tile-1024: "#88b4ad"
  tile-2048: "#344a2a"
  tile-2048-text: "#f1f5b0"
  tile-super: "#343d32"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "96px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "42px"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-.035em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "-.02em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.85
    letterSpacing: "normal"
  instruction-body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.9
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "11px"
    fontWeight: 800
    lineHeight: "normal"
    letterSpacing: ".06em"
  button:
    fontFamily: "Manrope, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: "normal"
    letterSpacing: "normal"
  score:
    fontFamily: "Manrope, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.4
    letterSpacing: "-.02em"
  tile:
    fontFamily: "Manrope, sans-serif"
    fontSize: "43px"
    fontWeight: 800
    lineHeight: "normal"
    letterSpacing: "-.035em"
rounded:
  control: "8px"
  tile: "9px"
  score: "10px"
  milestone: "12px"
  compact-board: "13px"
  board: "16px"
  compact-tile: "7px"
spacing:
  control-gap: "8px"
  compact-grid: "9px"
  grid: "12px"
  caption: "16px"
  section: "24px"
  spread-compact: "48px"
  spread: "92px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.button-text}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "12px 17px"
  button-primary-hover:
    backgroundColor: "{colors.button-hover}"
  button-secondary:
    backgroundColor: "{colors.secondary-surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "12px 17px"
  button-secondary-hover:
    backgroundColor: "{colors.secondary-hover}"
  direction-button:
    backgroundColor: "transparent"
    textColor: "{colors.direction-ink}"
    rounded: "{rounded.control}"
    size: "44px"
  direction-button-hover:
    backgroundColor: "{colors.best-surface}"
  direction-button-active:
    backgroundColor: "{colors.citrus}"
  score-card:
    backgroundColor: "{colors.score-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.score}"
    padding: "10px 15px 9px"
  score-card-best:
    backgroundColor: "{colors.best-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.score}"
    padding: "10px 15px 9px"
  tile-swatch:
    backgroundColor: "{colors.tile-2}"
    textColor: "{colors.ink}"
    typography: "{typography.tile}"
    rounded: "{rounded.tile}"
  game-board:
    backgroundColor: "{colors.board}"
    rounded: "{rounded.board}"
    padding: "{spacing.grid}"
    width: "100%"
  game-overlay:
    backgroundColor: "{colors.overlay-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.board}"
    padding: "24px"
---

# Design System: 2048 - Good things add up.

## Overview

**Creative North Star: "Printed color-study swatch book"**

Warm ivory stock, sharp dark Manrope, and solid numbered swatches make the puzzle feel like a printed color-study book. Quiet dividers and generous space let the working board lead. The color equation and square brand mark share its geometry.

The interface stays calm during repeated play: dark primary actions, small citrus feedback, tabular numbers, and progressive tile colors. Local typography, inline SVG, and CSS geometry provide the visual material; no raster illustration is required.

**Key Characteristics:**
- Warm paper and readable dark type.
- Progressive solid tile colors with visible numerals.
- A responsive square board and compact semantic controls.
- Flat tonal surfaces with softly rounded corners.
- Motion that explains slides, merges, and spawns.

## Colors

The frontmatter owns exact values; names below describe their jobs.

### Primary

- **Citrus** (`citrus`): text selection and pressed directional controls. Main action buttons use dark ink.
- **Ink** (`ink`): headings, tile numbers, brand geometry, and primary button fill.
- **Focus olive** (`focus-olive`): keyboard focus, help hover, and score-gain feedback.

### Secondary

- **Early greens** (`tile-2`, `tile-4`, `tile-8`): the opening tile sequence; the equation shares the first two.
- **Warm swatches** (`tile-16` through `tile-128`): yellow, ochre, orange, and rose.
- **Cool swatches** (`tile-256` through `tile-1024`): lilac, periwinkle, and teal.
- **Milestone forest** (`tile-2048`, `tile-2048-text`): dark green and pale lettering, also used by the overlay badge.
- **Beyond 2048** (`tile-super` with `paper` text): the higher-value tile treatment.

### Neutral

- **Paper**, **muted ink**, and **quiet line**: continuous canvas, supporting copy, and structural rules.
- **Board** and **cell**: the solid frame and empty-grid layers.
- **Score surface** and **best surface**: compact metric cards; `score-label` supplies their label ink.
- Button, directional-control, secondary-action, and overlay tokens retain the exact source assignments.

**The Number First Rule.** Color reinforces tile value; the visible numeral carries the game state.

## Typography

**Display Font:** Manrope (sans-serif fallback).
**Body Font:** Manrope (sans-serif fallback).

One self-hosted variable family supplies a precise, friendly voice. The shipped interface uses weights (500), (700), and (800).

- **Display:** the frontmatter display role reduces from (96px) to (66px) at the mobile breakpoint and (58px) on narrow screens.
- **Headline:** the supporting phrase reduces from (42px) to (37px), then (22px), then (19px). Mobile line-height is (1.3).
- **Title:** instruction headings reduce from (18px) to (16px) on mobile. Overlay headings use (32px), then (27px) on narrow screens.
- **Body:** intro copy uses the body role; instructions use instruction-body. Small helper text stays subordinate.
- **Label:** score labels are uppercase. Brand/help links use (13px, 700), reducing to (12px) on mobile.
- **Score:** normal sizes are (24px), (22px), then (20px). Values at or above (100000) use the compact (14px) treatment, with an overflow-wrap fallback.
- **Tile:** the base size is (43px), then (39px) in the compact desktop spread and (32px) on narrow screens. Three-, four-, five-, and longer-digit values use (35px / 28px / 22px / 16px), reducing to (26px / 21px / 17px / 12px) on narrow screens.
- **Button:** compact (12px, 700) labels accompany small inline SVG icons.

**The Stable Numeral Rule.** Use tabular numerals and reduce type size as digit counts grow so scores and tiles remain contained.

## Layout

Desktop uses a centered page capped at (1040px), with width `min(1040px, calc(100% - 80px))`. A flexible introduction sits beside a (468px) game column with a (92px) gap. The header is at least (112px) high; the main spread starts after (62px). Instructions align with both columns.

At a maximum width of (1040px), the page cap becomes (900px), total side allowance becomes (64px), and columns become `minmax(250px, 1fr) minmax(360px, 440px)` with a (48px) gap. At (780px), the layout stacks into a single column capped at (468px), with (40px) total side allowance and a (76px) header. The compact title-and-phrase row yields room to play; desktop descriptive copy and the teaching equation are hidden.

At (400px), page width becomes `calc(100% - 32px)`, board gaps become (9px), and the outer radius becomes (13px). Score cards use a (74px) minimum width with padding (8px 6px), retaining room for compact scores and New Game. The body minimum width is (280px); preserve the observed usable layout at (320px) and above.

The board always has an aspect ratio of (1), four equal columns, and four equal rows. Its normal padding and gaps both use the grid token. Scores and New Game share the toolbar; captions sit beneath the board; four directional controls remain centered below them.

## Elevation & Depth

The system is flat. Paper, a slightly darker frame, pale empty cells, solid tiles, and thin dividers provide separation. An almost opaque paper overlay occupies the board for end states. Keyboard focus uses a functional (3px) olive outline with a (5px) offset.

**The Paper Surface Rule.** Separate surfaces with solid tonal fills and quiet borders. The shipped system has no box shadows.

## Shapes

Square swatches define the geometry. The board, tiles, controls, score cards, and milestone badge use their extracted corner tokens. Compact tiles and board corners follow their narrow-screen tokens. Equation swatches share the control radius; small keycaps use (5px). Thin borders remain useful for keycaps, directional controls, and structural rules.

## Components

### Buttons

Primary actions use ink, warm lettering, the control radius, and the extracted padding. Minimum height is (46px), (44px) for mobile New Game, and (48px) inside overlays. Hover uses button-hover; pressing moves down (1px). Background and transform transitions take (160ms). Companion overlay actions use the tonal secondary surface and its hover token. Disabled buttons use (.5) opacity and a default cursor.

### Directional controls

Four native buttons are (44px) square with a thin outline and (18px) SVGs. Resting fill is transparent; hover uses best-surface and pressing uses citrus. Background transitions take (140ms). Preserve accessible direction names and the shared focus outline.

### Score containers

Normal minimum size is (94px) by (70px), with the score-card padding. Mobile uses (88px) by (64px) with (8px 13px) padding; the narrow form follows Layout. Best score adds a small inline star and its green surface. Score gain rises (35px) and fades over (700ms), without shifting the score.

### Header navigation

The small four-square SVG brand and help anchor sit on opposite ends of a ruled header. Help has a minimum (44px) interactive height, an arrow SVG, olive hover, and visible focus. Mobile scales the existing brand and type without introducing a drawer.

### Board and tiles

The signature surface is a responsive square containing sixteen tonal cells and numbered swatches. Live tiles move from their actual previous coordinates. Slides take (140ms) with `cubic-bezier(.2,.75,.3,1)`; a new tile scales from (.4) to (1) over (200ms); a merge peaks at (1.12) and settles over (220ms). Spawn and merge use `cubic-bezier(.19, 1, .22, 1)`. JavaScript resolves the normal slide after (145ms), or (0ms) with reduced motion. Fresh games retain real empty cells and two real tiles.

The board contains gestures with `touch-action: none`; content outside it scrolls normally. Semantic controls, a readable hidden table, and polite announcements support nonvisual play.

### End-state overlay

Success and game-over reuse paper, the forest milestone swatch, centered headings, and familiar actions. The overlay fills the board with (24px) padding and a (220ms) opacity entrance. Its (90px) square badge reduces to (70px) on narrow screens. Focus moves to the appropriate action and returns to the board when play resumes.

The reduced-motion media query disables animations and transitions and changes smooth document scrolling to immediate scrolling.

## Do's and Don'ts

### Do:
- **Do** reuse the actual paper, ink, and tile palette for new play states.
- **Do** preserve the square four-by-four board across supported widths.
- **Do** retain visible focus, semantic controls, and the screen-reader board table.
- **Do** resolve animation immediately when reduced motion is requested.

### Don't:
- **Don't** replace tile numbers with color-only meaning.
- **Don't** add gradients or shadows to the flat swatch surfaces.
- **Don't** allow controls or score numerals to force horizontal scrolling.
- **Don't** substitute decorative imagery for the established square geometry.
