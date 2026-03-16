import fs from "fs";
import path from "path";

export const imageToBase64 = (filePath: string): string => {
  try {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      const fileBuffer = fs.readFileSync(fullPath);
      const ext = path.extname(fullPath).slice(1);
      return `data:image/${ext};base64,${fileBuffer.toString("base64")}`;
    }
    return "";
  } catch {
    return "";
  }
};
