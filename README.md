# Capitol Blocks

A self-contained first-person browser game inspired by Texas Capitol site maps and floor plans. No install, account, server, or internet connection required.

Double-click **start-game.cmd** (Windows), or open **index.html** in Chrome, Edge, or Firefox. Click **Explore the Capitol**. If mouse lock is unavailable, hold the left mouse button and drag to look.

## Controls

- WASD / arrow keys: move; mouse: look.
- Shift: faster movement; Space: jump.
- F: toggle free flight; Space / Q: ascend / descend. Flight passes through walls for exploration.
- E: use the green lift pad in the north lobby to switch between the first floor and basement.
- R: return to Congress Avenue. Escape: pause and release mouse.

Find five golden markers: south promenade, rotunda, west wing, northern extension courtyard, and basement rotunda. Progress lasts for the current browser session.

The Capitol has a hollow voxel dome, columned south entrance, four connected lobbies/corridors, office alcoves, and a simplified basement. The district includes Congress Avenue, Colorado and Brazos streets, lawns, trees, nearby buildings, and the northern extension courtyard. Interiors follow the supplied cross-shaped floor plan approximately; this is a stylized prototype, not a measured replica or wayfinding tool. Upper floors, exact room numbers, working traffic, and block editing are not implemented.

Rendering uses native WebGL with no third-party libraries or remote assets. Desktop keyboard and mouse required. All source is in index.html, style.css, and game.js.
