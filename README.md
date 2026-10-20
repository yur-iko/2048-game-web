# 2048

A complete, responsive 2048 game built with plain HTML, CSS, and JavaScript. It runs entirely in the browser and can be published directly from this repository with GitHub Pages. No install, build step, CDN, account, or backend is required to play.

## Play

- **Desktop:** use the arrow keys or W / A / S / D.
- **Phone or tablet:** swipe up, down, left, or right on the board.
- **Any device:** use the four direction buttons below the board.
- **New Game** resets the board and current score, keeping the best score.

Matching tiles merge once per move, toward the movement direction. Each valid move adds one random tile: 90% chance of a 2, 10% chance of a 4. A move that changes nothing does not add a tile. Reach 2048 to win, then keep playing or start again. A full board with no adjacent matching tiles ends the game.

Your board, current score, best score, and choice to continue after winning are saved in this browser's local storage. Clearing site data clears them. A fresh game still works when storage is blocked. Touch scrolling is disabled on the board; the rest of the page scrolls normally.

## Preview locally

You can open `index.html` directly in a modern browser. To preview with a local web server, install Node.js 18 or newer and run:

```sh
node scripts/serve.cjs
```

Open **http://127.0.0.1:4173**. Stop the server with Ctrl+C. The server binds only to this computer. `PORT` may be set to use another port.

## Publish on GitHub Pages

The local repository is intended to use the `main` branch. Perform these account-level steps:

1. On GitHub, create an **empty repository** named `2048-game-web` under the account or organization you want to use. Public repositories can use GitHub Pages on GitHub Free. Leave the automatic README, license, and `.gitignore` options off, since the local repository already contains its first commit.
2. In a terminal opened in this directory, replace `YOUR-USERNAME` with the actual owner and run:

   ```sh
   git remote add origin https://github.com/YOUR-USERNAME/2048-game-web.git
   git push -u origin main
   ```

3. In the GitHub repository, open **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Choose **main** and **/(root)**, then **Save**.
6. Wait for GitHub to finish deployment. Pages settings will show the live URL, normally:

   ```text
   https://YOUR-USERNAME.github.io/2048-game-web/
   ```

The root `index.html` is the entry point. `.nojekyll` disables Jekyll processing. All asset paths are relative, so a repository subpath works. No GitHub Actions workflow or build command is needed. For later updates, commit and push to `main`; GitHub Pages republishes the site.

Official instructions: [Configuring a publishing source for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Verification

Run the engine tests with:

```sh
node --test tests/*.test.cjs
```

The suite checks directional merging, one merge per move, gaps, scoring, spawn probability boundaries, full boards, win detection, saved-board validation, swipe direction thresholds, and 2,500 directional cases against an independent merge oracle.

With the preview server running, open **http://127.0.0.1:4173/tests/browser.html** and select **Run tests**. This test page runs the real app in an iframe, using controlled saved boards to check the keyboard, direction buttons, touch start/move/end events, canceled gestures, overlays, restart during animation, persistence, corrupt data recovery, and unavailable storage. It restores the origin's saved game after finishing. Run tests separately from active play, since they temporarily use the same origin's storage.

The automated touch tests dispatch browser touch events. For final device acceptance, also play on a physical phone and check swiping, page scrolling outside the board, and portrait/landscape rotation.

Optional syntax checks:

```sh
node --check engine.js
node --check app.js
node --check scripts/serve.cjs
```

If npm is installed, the equivalent convenience commands are `npm start`, `npm test`, and `npm run check`. No npm dependencies are used.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Semantic game page, score displays, controls, help, and end states |
| `style.css` | Responsive layout, tile palette, movement, focus styles, and reduced motion |
| `engine.js` | Pure board, merging, spawn, win, and swipe logic |
| `app.js` | Rendering, keyboard/touch input, animation, persistence, and restart |
| `assets/` | Self-hosted Manrope font, its OFL license, and the favicon |
| `scripts/serve.cjs` | Dependency-free local preview server |
| `tests/` | Node engine tests and the real-browser integration harness |
| `PRODUCT.md`, `DESIGN.md` | Product constraints and design reference |

## Credits

Inspired by [2048 by Gabriele Cirulli](https://github.com/gabrielecirulli/2048). This game uses an independently written engine and interface. [Manrope](https://github.com/google/fonts/tree/main/ofl/manrope) is distributed under the SIL Open Font License; its license is included in `assets/OFL-Manrope.txt`.
