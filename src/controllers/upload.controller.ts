import { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { DataService } from "../services/data.service";

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve("uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `profile-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// File filter to only accept images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = /^(jpeg|jpg|png|gif)$/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase().slice(1),
  );
  const mimetype = /^image\/(jpeg|png|gif)$/.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Upload profile picture
router.post(
  "/upload-photo",
  upload.single("photo"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Get the relative path to store in cv.json
      const relativePath = `uploads/${req.file.filename}`;

      // Update CV data with new photo path
      const cvData = DataService.getData();
      const oldPhotoPath = cvData.header.picturePath;

      // Delete old photo if it exists and is in uploads directory
      if (oldPhotoPath && oldPhotoPath.startsWith("uploads/")) {
        const oldPath = path.resolve(oldPhotoPath);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      cvData.header.picturePath = relativePath;
      DataService.saveData(cvData);

      res.json({
        success: true,
        path: relativePath,
        url: `/${relativePath}`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload photo" });
    }
  },
);

export default router;
