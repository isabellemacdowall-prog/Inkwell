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
html = html.replace('<script type="module">', '<script type="module" src="./vendor/native.js"></script>\n<script type="module">');
writeFileSync(www + "index.html", html);
console.log("native/www ready");
