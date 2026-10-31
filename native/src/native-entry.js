// Native file saving for the Android app: write the file to the app cache in pieces
// (large PDFs are too big to pass across in one go), then open the share sheet.
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
const toB64 = blob => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(blob); });
const PIECE = 3 * 1024 * 1024; // multiple of 3 so each piece's base64 joins cleanly
async function writeBlob(name, blob) {
  for (let o = 0; o < Math.max(1, blob.size); o += PIECE) {
    const data = await toB64(blob.slice(o, o + PIECE));
    if (o === 0) await Filesystem.writeFile({ path: name, data, directory: Directory.Cache, recursive: true });
    else await Filesystem.appendFile({ path: name, data, directory: Directory.Cache });
  }
  return (await Filesystem.getUri({ path: name, directory: Directory.Cache })).uri;
}
window.InkNative = {
  async saveBlob(name, blob) {
    const uri = await writeBlob(name, blob);
    await Share.share({ title: name, url: uri, dialogTitle: "Save or send " + name });
  },
  async saveFile(name, base64, title) {
    const { uri } = await Filesystem.writeFile({ path: name, data: base64, directory: Directory.Cache, recursive: true });
    await Share.share({ title: title || name, url: uri, dialogTitle: "Save or send " + name });
  }
};
