# Adding your game to Dr Ecco (Fall 2026)

The live site is **https://cs.nyu.edu/~shasha/drecco**. Every game from 2016 to 2025 is in this repo under `content/games/<year>/`. Your game goes in `content/games/2026/`.

## What your game folder must contain

```
content/games/2026/YourGameName/
├── index.md        # title, team, rules (shown under the game)
├── iframe.html     # the game itself; opening it in a browser starts the game
├── thumbnail.png   # homepage card image (~4:3, shown about 100 px wide)
└── ...             # any CSS, JS, images, sounds your game uses
```

A starter folder is in `game-template/MyGame/`. Copy it, rename it, and replace the contents.

**`index.md` must start with this header** (the site won't build without it):

```toml
+++
title="Your Game Title"

[extra]
team="Your Team Name"
thumbnail="thumbnail.png"
+++
```

Then write your rules below it in Markdown.

## Rules that keep the site working

1. **The game is a static web page.** HTML, CSS and JavaScript only, running in the browser. No server, no PHP, no database, no Python backend. React, Vue, Elm, TypeScript or anything else that builds to static files is fine: put the **built** output in your folder, not the source project.
2. **Use relative paths only.** Write `src="game.js"` or `src="images/board.png"`, never `/game.js`, `C:\...` or `http://localhost`. Avoid outside CDNs; copy the library into your folder.
3. **Everything lives inside your folder.** Nothing may be linked from outside it.
4. **Folder name: no spaces.** Use `MyGame` or `my-game`. The URL becomes `.../games/2026/mygame/`.
5. **Only one `.md` file:** `index.md`. Rename any README to `README.markdown`, or the site will try to turn it into a page.
6. **Design for a 1280 × 960 frame.** The site shows the game in a 1280×960 iframe scaled down to 904×678 px. If your game is taller, add `iframe_container_height=<px>` under `[extra]` (678 is the default). The game page also has an "Open Game in Popup Window" button.
7. **Keep it small:** no `node_modules`, no build tools or installers, no file over 50 MB.

## Check it before you submit

- Double-click `iframe.html`. The game should start with no console errors.
- Optional: preview it inside the real site.
  1. Install [Zola 0.19](https://www.getzola.org/documentation/getting-started/installation/) (on a Mac, `brew install zola`).
  2. Run `zola serve` in the repo root.
  3. Open http://127.0.0.1:1111.

## How to submit

**Option A: pull request (preferred)**
1. Fork this repo on GitHub, then clone your fork.
2. Add `content/games/2026/YourGameName/`.
3. Commit, push, and open a pull request titled `2026: Your Game Title`.

**Option B: send a zip.** Zip your game folder and send it to the site maintainer. It must follow the same structure.

The maintainer merges submissions and sends the final build to Prof. Shasha to publish.
