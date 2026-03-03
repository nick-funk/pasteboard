import fs from "fs";

export const ensureDirectoryExists = (dir: string) => {
  try {
    if (fs.existsSync(dir)) {
      return;
    }

    fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    // ignore
  }
}