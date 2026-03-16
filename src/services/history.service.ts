import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve("output");

export interface CVFile {
  filename: string;
  createdAt: Date;
  size: number;
}

export class HistoryService {
  static getList(): CVFile[] {
    if (!fs.existsSync(OUTPUT_DIR)) return [];

    const files = fs
      .readdirSync(OUTPUT_DIR)
      .filter((f) => f.endsWith(".pdf"))
      .map((f) => {
        const stats = fs.statSync(path.join(OUTPUT_DIR, f));
        return {
          filename: f,
          createdAt: stats.birthtime,
          size: stats.size,
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Newest first
      .slice(0, 10); // Keep last 10

    return files;
  }

  static deleteFile(filename: string): boolean {
    const filePath = path.join(OUTPUT_DIR, filename);
    // Security check to prevent directory traversal
    if (path.dirname(filePath) !== OUTPUT_DIR) return false;

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
}
