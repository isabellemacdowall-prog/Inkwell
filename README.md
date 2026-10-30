# Inkwell Notes

A handwriting notebook app (in the spirit of GoodNotes) that installs to the home screen on iPad and Android and syncs through Firebase.

- Pen with Apple Pencil pressure, highlighter, eraser, undo/redo
- Blank, lined, grid and dotted paper, chosen per page
- "Pencil only" mode: turns on automatically when a stylus is detected, so fingers scroll and pinch-zoom
- Works offline; changes sync when the device reconnects
- Save any page as an image

## How it's put together

| File | Purpose |
| --- | --- |
| `index.html` | The whole app (HTML, CSS and JS in one file) |
| `manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png` | Home-screen install |
| `sw.js` | Caches the app so it opens offline |
| `firestore.rules` | Security rules: each user can only reach `users/{their uid}/…` |

Data lives in Firestore at `users/{uid}/notebooks/{notebookId}` (title, cover, page list) and `users/{uid}/notebooks/{notebookId}/chunks/{pageId}_{n}` (strokes, split into ~180 KB chunks).

## Firebase setup

1. Authentication → Sign-in method → enable **Email/Password**.
2. Authentication → Settings → Authorized domains → add `isabellemacdowall-prog.github.io`.
3. Firestore → Rules → paste `firestore.rules` → Publish.

## Hosting

Served by GitHub Pages from the `main` branch root at https://isabellemacdowall-prog.github.io/Inkwell/.
When changing the app, bump `VERSION` in `sw.js` so installed copies pick up the update.
