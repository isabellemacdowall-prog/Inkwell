# Inkwell Notes

A handwriting notebook app (in the spirit of GoodNotes) that installs to the home screen on iPad and Android and syncs through Firebase.

- Pen with Apple Pencil pressure, highlighter, eraser, undo/redo
- Blank, lined, grid and dotted paper, chosen per page
- "Pencil only" mode: turns on automatically when a stylus is detected, so fingers scroll and pinch-zoom
- Works offline; changes sync when the device reconnects
- Import a PDF (up to 1,000 pages) as a notebook, write on it, and download the whole notebook as a PDF
- Save any page as an image
- Swipe left/right to turn pages (one finger in Pencil-only mode, two fingers any time, trackpad on a computer)
- Backup: download every notebook (handwriting + PDFs) as one .json file, and restore it later
- Android app (APK) built automatically on every change; iPad uses the home-screen web app

## How it's put together

| File | Purpose |
| --- | --- |
| `index.html` | The whole app (HTML, CSS and JS in one file) |
| `manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png` | Home-screen install |
| `sw.js` | Caches the app so it opens offline |
| `firestore.rules` | Security rules: each user can only reach `users/{their uid}/…` |
| `native/` | Android app build: Capacitor config, icons, signing key, build scripts |
| `.github/workflows/android.yml` | Builds `Inkwell.apk` and attaches it to a GitHub Release |

Data lives in Firestore at `users/{uid}/notebooks/{notebookId}` (title, cover, page list) and `users/{uid}/notebooks/{notebookId}/chunks/{pageId}_{n}` (strokes, split into ~180 KB chunks). Imported PDF pages are stored as JPEG images at `users/{uid}/notebooks/{notebookId}/bgs/{pageId}`.

## Firebase setup

1. Authentication → Sign-in method → enable **Email/Password**.
2. Authentication → Settings → Authorized domains → add `isabellemacdowall-prog.github.io`.
3. Firestore → Rules → paste `firestore.rules` → Publish.

## Hosting

Served by GitHub Pages from the `main` branch root at https://isabellemacdowall-prog.github.io/Inkwell/.
When changing the app, bump `VERSION` in `sw.js` so installed copies pick up the update.

## Android app

Every push to `main` runs **Build Android app** in GitHub Actions. It copies the web app into a Capacitor
project, bundles Firebase locally (so the app opens offline), applies the icon and splash, signs the APK with
`native/signing/inkwell.jks` and publishes it as a GitHub Release. Install the latest from the Releases page.
Keep the same keystore so new versions install over the old one.
