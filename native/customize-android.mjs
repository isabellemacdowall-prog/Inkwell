// Applies Inkwell's icon, splash, version and signing to the generated Capacitor Android project.
import { readdirSync, copyFileSync, rmSync, writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
const root = new URL("./", import.meta.url).pathname;
const res = root + "android/app/src/main/res/";
for (const d of ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"])
  for (const n of ["ic_launcher", "ic_launcher_round", "ic_launcher_foreground"])
    copyFileSync(`${root}icons/${d}-${n}.png`, `${res}mipmap-${d}/${n}.png`);
mkdirSync(res + "values", { recursive: true });
writeFileSync(res + "values/ic_launcher_background.xml",
  '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#2F56C9</color>\n</resources>\n');
// Splash: remove Capacitor's default images, use the Inkwell icon on the app background.
for (const d of readdirSync(res)) if (d.startsWith("drawable") && existsSync(`${res}${d}/splash.png`)) rmSync(`${res}${d}/splash.png`);
copyFileSync(root + "icons/splash_icon.png", res + "drawable/splash_icon.png");
writeFileSync(res + "drawable/splash.xml", `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item><color android:color="#E9EDF2"/></item>
    <item android:gravity="center" android:width="144dp" android:height="144dp" android:drawable="@drawable/splash_icon"/>
</layer-list>
`);
// Version: every build gets a higher number so installs update in place.
const run = process.env.GITHUB_RUN_NUMBER || "1";
const gradlePath = root + "android/app/build.gradle";
let g = readFileSync(gradlePath, "utf8");
g = g.replace(/versionCode \d+/, `versionCode ${run}`).replace(/versionName "[^"]*"/, `versionName "1.0.${run}"`);
writeFileSync(gradlePath, g);
console.log("Android project customised, version 1.0." + run);
