# Capitol Blocks

A self-contained first-person browser game inspired by Texas Capitol site maps and floor plans. No install, account, server, or internet connection required.

**[Play in your browser](https://kelleyparker.github.io/capitol-blocks/)**

![Photo-inspired block-built Capitol and landscaped grounds](docs/capitol-exterior.png)

Double-click **start-game.cmd** (Windows), or open **index.html** in Chrome, Edge, or Firefox. Click **Explore the Capitol**. If mouse lock is unavailable, hold the left mouse button and drag to look.

## Controls

- WASD / arrow keys: move; mouse: look.
- Shift: faster movement; Space: jump.
- F: toggle free flight; Space / Q: ascend / descend. Flight passes through walls for exploration.
- E: open the elevator floor selector on a green pad. The elevator serves Ground, 1, 2, 3, 4, E1, and E2. Extension elevator pads are at Seal Court, beside Central Court, and near the northern tunnels.
- Walk outward along either first-floor wing staircase to enter the second-floor chambers. Further stairs beside the north wing connect floors 2, 3, and 4. Press E on a marked stair landing to descend.
- Extension E1 has a walkable descending stair beside Seal Court to E2; the corresponding E2 staircase returns to E1. No jumping required.
- R: return to Congress Avenue. Escape: pause and release mouse.

Find twelve golden markers across the grounds, Capitol floors, and underground extension. Progress lasts for the current browser session. Each interior has a floor map and room names in the HUD.

The Capitol has seven explorable levels based on the supplied floor plans:

| Level | Spaces |
| --- | --- |
| Ground | Basement rotunda and corridors |
| 1 | Four lobbies, rotunda, office alcoves, grounds |
| 2 | West House Chamber, east Senate Chamber, north Legislative Reference Library, south reception room |
| 3 | House and Senate viewing galleries overlooking the chamber floors, north and south rooms |
| 4 | A compact rotunda, north offices, and south rooms |
| E1 | Seal Court, Central Court, central gallery, numbered hearing rooms and office rows, gift shop, House Mail, Press Corps, First Lady office, cafeteria, auditorium, and building/service tunnels |
| E2 | Court and gallery layout, offices, staff suites, Legislative Conference Center |

Chambers include desk rows, seating, a rostrum, and generous aisles. The extension follows the long north/south layout with light courts and numbered office bands. Interior scenes are loaded through stairs and elevators and each scene draws only its own geometry. Sizes, furnishings, office numbers, stair placement, and floor transitions are simplified interpretations; this is not a measured replica or wayfinding tool. Working traffic and block editing are not implemented.

E1 office rows use the supplied plan's west 200–500 and east 600–900 room sequences. Named rooms include E1.030 House Appropriations, E1.034 Legislative Budget Board, E1.036 Senate Finance, E1.706 Senate Mail, and E1.908 Engrossing & Enrolling. Short explorable tunnels lead toward the Reagan, Workforce Commission/Robert E. Johnson, Supreme Court, and Sam Houston buildings; the loading-dock passage leads west toward 13th and Colorado. Tunnel destinations beyond these passages are not modeled.

The photo-inspired exterior includes granite facade courses, pilasters, framed windows, arched porticos, walkable entrance steps, copper roofs, end pavilions, and a layered dome with columns, ribs, a lantern, and a block statue. Oak-lined paths, curved drives, globe lamps, flower beds, monuments, and extension courtyard details focus exploration on the Capitol property.

Rendering uses native WebGL with no third-party libraries or remote assets. Desktop keyboard and mouse required. Source is in index.html, style.css, game.js, exterior.js, and interiors.js.

## Publishing

GitHub Actions automatically publishes the game to GitHub Pages on every push to `main`. The workflow validates JavaScript syntax, uploads the game files, and deploys the site. You can also run **Publish game to GitHub Pages** manually from the repository's Actions tab. Changes must be committed and pushed to GitHub to trigger publishing.
