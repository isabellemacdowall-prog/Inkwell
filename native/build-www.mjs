// Copies the web app into native/www and points it at the bundled Firebase + native helpers.
import { mkdirSync, copyFileSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
const root = new URL("../", import.meta.url).pathname;
const www = root + "native/www/";
mkdirSync(www + "vendor", { recursive: true });
for (const f of readdirSync(root)) if (/\.(png|webmanifest)$/.test(f)) copyFileSync(root + f, www + f);
let html = readFileSync(root + "index.html", "utf8");
const before = html;
html = html.replace(/https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\/firebase-(app|auth|firestore)\.js/g, "./vendor/firebase.js");
if (html === before) throw new Error("Firebase CDN imports not found in index.html");
// PDF libraries ship inside the app so PDFs open offline (files copied by the workflow).
html = html.replace("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", "./vendor/pdf.min.js")
  .replace("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js", "./vendor/pdf.worker.min.js")
  .replace("https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js", "./vendor/pdf-lib.min.js");
if (html.includes("cdnjs.cloudflare.com")) throw new Error("A cdnjs URL was left in the Android build");
html = html.replace('<script type="module">', '<script type="module" src="./vendor/native.js"></script>\n<script type="module">');
writeFileSync(www + "index.html", html);
console.log("native/www ready");
