import multer, { type FileFilterCallback } from "multer";
import path from "node:path";
import type { NextFunction, Request, Response } from "express";
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

const multerInstance = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/**
 * Middleware de multer para subir una única imagen de producto.
 * El archivo se guarda en memoria y el controlador se encarga de persistirlo.
 */
export const uploadProductImage = multerInstance.single("image");

/**
 * Middleware opcional: solo procesa el archivo si el Content-Type es multipart/form-data.
 * Permite que un mismo endpoint acepte JSON (sin imagen) y multipart/form-data (con imagen).
 */
export const uploadProductImageIfMultipart = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const contentType = req.headers["content-type"] ?? "";
  if (contentType.includes("multipart/form-data")) {
    multerInstance.single("image")(req, _res, next);
  } else {
    next();
  }
};
