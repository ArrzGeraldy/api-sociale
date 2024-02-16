import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { logger } from "../utils/logger";

export const uploadMultiple = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("image", 12);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3000000 },
  fileFilter: async function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");
export const handleFileSizeError = (
  err: { code: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error) {
    logger.info("failed upload image");
    logger.error(err.message);
    // Jika kesalahan disebabkan oleh jenis file yang tidak diizinkan
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

// // Check file Type
export function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  // Allowed ext

  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Only image files are allowed"));
  }
}
