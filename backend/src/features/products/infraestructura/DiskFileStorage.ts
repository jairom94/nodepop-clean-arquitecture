import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import type { IFileStorage, StoredFile } from "../domain/FileStorage.js";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");
const PRODUCTS_DIR = path.join(UPLOAD_DIR, "products");

const DESKTOP_WIDTH = 1200;
const DESKTOP_HEIGHT = 800;
const THUMB_WIDTH = 400;
const THUMB_HEIGHT = 300;
const WEBP_QUALITY = 80;
const THUMB_QUALITY = 70;

/** Formatos aceptados según el contenido real, no según lo que declare el cliente. */
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp", "gif"]);
/** Evita imágenes "bomba" que ocupan poco pero se descomprimen en miles de megapíxeles. */
const MAX_INPUT_PIXELS = 40_000_000; // p. ej. 8000 x 5000

const invalidImage = () =>
  ValidationError.fromManual("image", "La imagen no es válida o no es JPG, PNG, WebP o GIF");

export class DiskFileStorage implements IFileStorage {
  async save(file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  }): Promise<StoredFile> {
    // El tipo MIME y la extensión los decide el cliente: se comprueba el contenido real
    let format: string | undefined;
    try {
      ({ format } = await sharp(file.buffer, { limitInputPixels: MAX_INPUT_PIXELS }).metadata());
    } catch {
      throw invalidImage();
    }
    if (!format || !ALLOWED_FORMATS.has(format)) {
      throw invalidImage();
    }

    await fs.mkdir(PRODUCTS_DIR, { recursive: true });

    // Nombre aleatorio: dos subidas simultáneas no se pisan y no se puede adivinar
    const baseName = `product-${randomUUID()}`;
    const filename = `${baseName}.webp`;
    const thumbnailFilename = `${baseName}-thumb.webp`;
    const filePath = path.join(PRODUCTS_DIR, filename);
    const thumbPath = path.join(PRODUCTS_DIR, thumbnailFilename);

    await sharp(file.buffer, { limitInputPixels: MAX_INPUT_PIXELS })
      .resize(DESKTOP_WIDTH, DESKTOP_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(filePath);

    await sharp(file.buffer, { limitInputPixels: MAX_INPUT_PIXELS })
      .resize(THUMB_WIDTH, THUMB_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: THUMB_QUALITY })
      .toFile(thumbPath);

    const stat = await fs.stat(filePath);

    return {
      filename: `products/${filename}`,
      thumbnailFilename: `products/${thumbnailFilename}`,
      path: filePath,
      mimetype: "image/webp",
      size: stat.size,
    };
  }

  async delete(filename: string): Promise<void> {
    const baseFilename = filename.replace(/^products\//, "");
    const thumbnailFilename = `products/${baseFilename.replace(/\.webp$/, "-thumb.webp")}`;

    const filesToDelete = [
      path.join(UPLOAD_DIR, filename),
      path.join(UPLOAD_DIR, thumbnailFilename),
    ];

    await Promise.all(
      filesToDelete.map(async (filePath) => {
        try {
          await fs.unlink(filePath);
        } catch {
          // Ignorar si el archivo no existe
        }
      }),
    );
  }
}
