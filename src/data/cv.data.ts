import fs from "fs";
import path from "path";
import { CVData } from "./cv.schema";

// Load CV data from cv.json at the root
const CV_FILE = path.resolve("cv.json");
const CV_EXAMPLE_FILE = path.resolve("cv.example.json");

let cachedCV: CVData | null = null;

function loadCV(): CVData {
  if (cachedCV) return cachedCV;

  // In test environment, use example file if cv.json doesn't exist
  const fileToLoad =
    !fs.existsSync(CV_FILE) && fs.existsSync(CV_EXAMPLE_FILE)
      ? CV_EXAMPLE_FILE
      : CV_FILE;

  if (!fs.existsSync(fileToLoad)) {
    throw new Error(
      `cv.json not found at ${CV_FILE}. Please create one based on cv.example.json`,
    );
  }

  try {
    const rawData = fs.readFileSync(fileToLoad, "utf-8");
    cachedCV = JSON.parse(rawData);
    return cachedCV as CVData;
  } catch (error) {
    throw new Error(`Failed to parse ${fileToLoad}: ${error}`);
  }
}

// Use a getter to load data lazily
export const myCV = new Proxy({} as CVData, {
  get: (target, prop) => {
    const data = loadCV();
    return (data as any)[prop];
  },
  ownKeys: () => {
    const data = loadCV();
    return Reflect.ownKeys(data);
  },
  getOwnPropertyDescriptor: (target, prop) => {
    const data = loadCV();
    return Object.getOwnPropertyDescriptor(data, prop);
  },
});
