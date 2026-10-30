// Native file saving for the Android app: write to the app cache, then open the share sheet.
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
window.InkNative = {
  async saveFile(name, base64, title) {
    const { uri } = await Filesystem.writeFile({ path: name, data: base64, directory: Directory.Cache, recursive: true });
    await Share.share({ title: title || name, url: uri, dialogTitle: "Save or send " + name });
  }
};
