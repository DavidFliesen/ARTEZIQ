# Angler's Jigsaw v2.0.3

Angler's Jigsaw is a fishing-inspired jigsaw puzzle Progressive Web App designed first for GitHub Pages and modern browsers, with the longer-term goal of packaging it for iOS and Android.

Version 2.0 introduced the gameplay redesign. Version 2.0.1 is the first interaction-stability and traditional-piece-shape test build. The central idea is that solving a jigsaw is not only about placing pieces into fixed slots. The fun comes from handling pieces, sorting them, making piles, testing relationships, building clusters, changing strategies, and gradually turning a table full of pieces into a completed picture.

## v2.0 gameplay philosophy

The game should support the player's process instead of forcing one correct way to solve a puzzle.

Players can:

- drag a piece from the Tackle Tray and leave it anywhere on the tabletop;
- make their own piles by edge, color, pattern, shape, or connector type;
- scatter all edge pieces onto the table with one button;
- scatter all remaining tray pieces onto the table;
- connect correct neighboring pieces anywhere on the table;
- move connected pieces together as a cluster;
- snap-lock a single piece or connected cluster into its correct location in the puzzle frame;
- recall only unconnected single pieces back to the tray while keeping connected clusters and locked pieces on the table;
- filter the tray by edges, corners, and number/direction of outward tabs;
- hide the tray to gain more playing room;
- use full-screen mode for the largest practical play area;
- toggle an optional preview of the finished image.

The game intentionally does **not** return a freely placed piece to the tray simply because it is not near its final location. The tabletop is the player's workspace.

## Puzzle flow

1. Open **Start Fishing**.
2. Choose one of four difficulty levels.
3. Choose the fish image you want to solve.
4. Solve it using whatever strategy you prefer.
5. Finish the puzzle to see the species information.
6. The completed fish is recorded in the **Fish Cooler**.

There is no water-selection or rapid-click fishing mini-game in v2.0.

## Difficulty levels

All puzzle sizes preserve the same 4:3 board proportion:

- **12 pieces** — 4 × 3
- **48 pieces** — 8 × 6
- **108 pieces** — 12 × 9
- **192 pieces** — 16 × 12

This keeps one consistent board shape while increasing puzzle complexity.

## Tackle Tray and sorting

The Tackle Tray is a horizontal scrolling strip at the bottom of the play screen. It can be collapsed to increase the available tabletop.

The tray filter supports:

- All pieces
- Edges
- Corners
- 0 outward tabs
- 1 outward tab
- 1 outward tab facing up
- 1 outward tab facing right
- 1 outward tab facing down
- 1 outward tab facing left
- 2 outward tabs
- 3 outward tabs
- 4 outward tabs

These filters are optional helpers. Players are still free to build their own piles anywhere on the table.

## Scatter and recall tools

### Edges to Table

Moves all loose edge pieces from the tray to the table and scatters them around the puzzle area. This supports players who like to sort corners and top/bottom/left/right edges before building the frame.

### All to Table / Recall Singles

This is one two-state control.

**All to Table**
- scatters every loose tray piece onto the tabletop.

After use, the same control becomes **Recall Singles**.

**Recall Singles**
- returns only completely unconnected, unlocked single pieces to the tray;
- leaves connected groups on the table;
- leaves pieces already locked to the puzzle frame untouched.

This supports a more exploratory "pile and search" style of solving without destroying progress.

## Piece behavior

Each puzzle piece has one of these states:

1. **Tray** — waiting in the Tackle Tray.
2. **Loose on Table** — freely positioned by the player.
3. **Connected Cluster** — correctly connected to one or more neighboring pieces; the cluster moves together.
4. **Locked to Puzzle** — the piece or cluster has reached the correct puzzle-frame position and is locked into place.

Correct neighboring pieces can connect anywhere on the tabletop. A connected cluster preserves the correct relative geometry between all of its pieces.

## Puzzle-piece design

Version 2.0 uses a conventional ribbon-cut visual language:

- flat outer borders;
- centered rounded tabs (outward knobs);
- centered rounded blanks (inward sockets);
- mirrored neighboring edges so the connectors match exactly.

The piece engine uses SVG clipping so each piece contains the correct portion of the same full puzzle image.

## Play-area design

The play screen is intentionally different from the earlier 50/50 board-and-tray layout.

Version 2.0 uses:

- a large free tabletop;
- a centered 4:3 puzzle frame;
- staging/sorting space around the frame;
- a compact toolbar;
- a collapsible bottom tray.

The play screen uses `100svh` to reduce layout jumping on mobile Safari when browser controls appear or disappear. The puzzle geometry is recalculated deliberately when entering full screen, changing orientation, or changing the tray size rather than continuously rebuilding the board.

## Full-screen play

The **Full Screen** button uses the browser Fullscreen API when available.

On browsers or installation modes that do not expose the API, the rest of the game continues normally.

## Preview

The finished image is hidden by default inside the puzzle frame.

The **Preview** button shows a translucent version of the completed image as an optional guide. This can be turned off again at any time.

## Fish Cooler

The Fish Cooler is stored locally in the browser with `localStorage`.

For each completed species it records:

- number of completions;
- largest piece count completed;
- first completion date.

No account or server is required for this starter PWA.

## Current fish

- Largemouth Bass
- Bluegill
- Channel Catfish
- Rainbow Trout
- Brook Trout
- Red Drum

## Artwork status

The current SVG fish images are **prototype artwork**.

They are useful for testing puzzle mechanics but are not the intended final visual quality for the game.

The planned art direction is:

- biologically accurate by species;
- attractive naturalist/game illustration style;
- consistent across the entire fish library;
- composed specifically for a 4:3 puzzle canvas;
- no species-name text printed into the actual puzzle image;
- no artificial filler bars;
- enough visual detail and color variation to make the image enjoyable to solve.

Species accuracy should be checked against reliable reference material before final game artwork is approved.

## Version number

The active build number is shown in small text at the bottom of every screen:

`Angler's Jigsaw • v2.0.3`

This is intentional. During game testing, screenshots and bug reports should always include the visible version number so errors can be matched to the correct build.

The version value is defined once in `js/app.js` as `APP_VERSION`.

## Current platform target

Version 2.0 is a browser/PWA build intended for:

- iPadOS / iOS Safari
- Android browsers
- Windows
- macOS
- Linux
- installable PWA use where supported

Pointer Events are used for mouse, touch, pen, and stylus input.

## PWA / GitHub Pages

The project is designed to be hosted from a GitHub Pages repository or project folder.

The service worker uses:

- network-first loading for the HTML, CSS, and JavaScript app shell;
- cached assets for offline-friendly behavior;
- cache version `anglers-jigsaw-v2-0-3`.

This reduces the likelihood that an older JavaScript or CSS build remains stuck in the browser during testing.

## Testing priorities for v2.0

Before adding more features, test these behaviors carefully on iPad, desktop, and phone:

1. Drag individual pieces from the tray and leave them anywhere on the table.
2. Move a loose table piece repeatedly without the board jumping.
3. Connect two true neighboring pieces away from the puzzle frame.
4. Drag a connected cluster and confirm it moves as one unit.
5. Connect a cluster to another cluster.
6. Move a piece or cluster near its correct frame position and confirm snap-lock.
7. Use **Edges to Table** and sort pieces manually.
8. Use **All to Table** and then **Recall Singles**.
9. Confirm Recall Singles does not remove connected clusters.
10. Confirm Recall Singles does not remove locked pieces.
11. Test tray filters, including the outward-tab categories.
12. Collapse and reopen the tray.
13. Enter and exit full-screen mode.
14. Rotate the device and confirm the tabletop remains usable.
15. Complete a puzzle and confirm the Fish Cooler records it.
16. Confirm the visible version number reads `v2.0.3`.

## Recommended next development phases

### 2.1 — interaction polish
- optional snap sound;
- subtle haptic feedback where supported;
- cluster connection animation;
- improved scatter spacing;
- optional timer / relaxed mode;
- save an unfinished puzzle locally.

### 2.2 — artwork replacement
- build the accurate 4:3 naturalist fish-art library;
- replace prototype SVG fish images;
- add image-quality review and species-accuracy checks.

### 2.3 — puzzle library
- larger fish selection;
- habitat collections;
- favorites;
- recently played puzzles;
- completion badges and collection progress.

## Project goal

Angler's Jigsaw should feel like a puzzle table for anglers, not a slot-placement exercise.

The player should have enough freedom to develop a personal solving strategy, enough tactile feedback to enjoy manipulating pieces, and puzzle artwork good enough that completing the image feels worth the effort.


## v2.0.1 bug-fix notes

This test build addresses issues found during iPad testing:

- Replaced the earlier simplified connector profile with a more familiar traditional ribbon-cut jigsaw silhouette using narrow necks and fuller rounded knob/socket heads.
- Starting a new puzzle now removes every old board piece and drag proxy before the new puzzle is constructed.
- An unlocked single piece can be dragged from the tabletop back into the Tackle Tray.
- Connected groups are protected from accidental destruction if they are dragged over the tray.
- iPad/iPhone uses a stable app-level full-screen layout instead of native element fullscreen, because Safari can exit native fullscreen during touch-drag gestures.
- Pinch and double-tap zoom gestures are suppressed while actively playing to reduce the chance of becoming stuck zoomed into the board.
- The home/header logo is cropped more tightly so the surrounding black source-image canvas is no longer intended to show around the icon.


## v2.0.2 puzzle-piece shape update

- Replaced the previous piece silhouette with a simpler classic jigsaw profile based directly on the user's reference examples.
- Tabs and sockets are now centered circular forms with straighter ribbon-cut lines, matching the visual language players expect from a traditional jigsaw puzzle.
- This build focuses specifically on the piece-shape correction request.


## v2.0.3 transparent logo update

- Replaced `assets/images/logo.png` with the supplied transparent-background logo.
- Removed the CSS background-image zoom/crop workaround previously used to hide black padding.
- The header and opening-screen logo now render the PNG directly with `object-fit: contain`.
- No artificial black box or CSS-created border should appear around the logo.
