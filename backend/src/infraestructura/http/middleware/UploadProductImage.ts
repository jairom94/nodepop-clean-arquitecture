import multer, { type FileFilterCallback } from "multer";
import path from "node:path";
import type { Request } from "express";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const ALLOWED_MIMETYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXTENSIONS.includes(ext) && ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ValidationError.fromManual(
        "image",
        `Tipo de archivo no permitido. Formatos válidos: ${ALLOWED_EXTENSIONS.join(", ")}`,
      ),
    );
  }
};

/**
 * Middleware de multer para subir una única imagen de producto.
 * El archivo se guarda en memoria y el controlador se encarga de persistirlo.
 */
export const uploadProductImage = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).single("image");
