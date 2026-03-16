import fs from "fs";
import path from "path";
import { CVData, CVSchema } from "../data/cv.schema";

// Import initial data to seed data file if missing
import { myCV } from "../data/cv.data";

const DATA_FILE = path.resolve("cv.json");

export class DataService {
  static getData(): CVData {
    if (!fs.existsSync(DATA_FILE)) {
      console.log("cv.json missing. Seeding from cv.data.ts...");
      this.saveData(myCV);
    }

    const rawData = fs.readFileSync(DATA_FILE, "utf-8");
    try {
      return JSON.parse(rawData);
    } catch (e) {
      console.error("Failed to parse cv.json");
      throw e;
    }
  }

  static saveData(data: CVData): void {
    // Validate before saving
    const validation = CVSchema.parse(data);
    fs.writeFileSync(DATA_FILE, JSON.stringify(validation, null, 2));
  }

  // Helper to seed data
  static seed(data: CVData) {
    if (!fs.existsSync(DATA_FILE)) {
      this.saveData(data);
      console.log("Seeded cv.json with initial data");
    }
  }
}
