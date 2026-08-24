import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { IFileStorage, StoredFile } from "../domain/FileStorage.js";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

export class DiskFileStorage implements IFileStorage {
  async save(file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  }): Promise<StoredFile> {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${randomUUID()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    await fs.writeFile(filePath, file.buffer);

    return {
      filename,
      path: filePath,
      mimetype: file.mimetype,
      size: file.buffer.length,
    };
  }

  async delete(filename: string): Promise<void> {
    const filePath = path.join(UPLOAD_DIR, filename);
    try {
      await fs.unlink(filePath);
    } catch {
      // Ignorar si el archivo no existe
    }
  }
}
