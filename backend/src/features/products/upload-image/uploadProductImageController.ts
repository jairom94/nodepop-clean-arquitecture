import { NextFunction, Request, Response } from "express";
import { UploadProductImageHandler } from "./uploadProductImageHandler.js";
import { FileNotProvidedError } from "./errors/FileNotProvided.js";

export class UploadProductImageController {
  constructor(private readonly handler: UploadProductImageHandler) {}

  async execute(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new FileNotProvidedError();
      }

      const product = await this.handler.execute({
        id: Number(req.params.id),
        file: {
          buffer: req.file.buffer,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
        },
      });
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
}
