import express from "express";
import { CVController } from "./controllers/cv.controller";
import { EditorController } from "./controllers/editor.controller";
import uploadController from "./controllers/upload.controller";

const app = express();
const PORT = 3000;

// EJS configuration
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));
app.use("/output", express.static("output"));
app.use("/uploads", express.static("uploads"));

// Routes
app.get("/", EditorController.editor); // Public Editor
app.post("/generate-cv", CVController.generate); // Generate from POST (Editor)

// Legacy / Query-based generation
app.get("/generate-cv", CVController.generate);

// API
app.get("/api/color", CVController.getColor);
app.get("/api/history", CVController.getHistory);
app.delete("/api/history/:filename", CVController.deleteHistory);

// Upload
app.use("/api", uploadController);

app.listen(PORT, () => {
  console.log(`\n🚀 CV Generator is live!`);
  console.log(`🌐 Editor:    http://localhost:${PORT}`);
  console.log(
    `📄 Generate:  http://localhost:${PORT}/generate-cv?domain=apple.com`,
  );
  console.log(`⚡ CLI:       npm run create -- apple.com\n`);
});
