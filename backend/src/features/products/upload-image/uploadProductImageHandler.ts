import { IProductRepository } from "../domain/productRepository.js";
import { IFileStorage } from "../domain/FileStorage.js";
import { PrismaProductMapper } from "../infraestructura/PrismaProductMapper.js";
import { UploadProductImageCommand } from "./uploadProductImageCommand.js";
import { ProductNotFoundError } from "../update/errors/ProductNotFound.js";

interface ProductResponse {
  id: number | null;
  name: string;
  price: number;
  ownerId: number;
  image: string | null;
  tags: { id: number | null; name: string }[];
}

export class UploadProductImageHandler {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly fileStorage: IFileStorage,
  ) {}

  async execute(command: UploadProductImageCommand): Promise<ProductResponse> {
    if (!Number.isInteger(command.id) || command.id <= 0) {
      throw new ProductNotFoundError(command.id);
    }

    const product = await this.productRepository.findById(command.id);
    if (!product) {
      throw new ProductNotFoundError(command.id);
    }

    const stored = await this.fileStorage.save({
      buffer: command.file.buffer,
      originalname: command.file.originalname,
      mimetype: command.file.mimetype,
    });

    // Eliminar imagen anterior si existía
    if (product.image) {
      const oldFilename = product.image.split("/").pop();
      if (oldFilename) {
        await this.fileStorage.delete(oldFilename);
      }
    }

    const imageUrl = `/uploads/${stored.filename}`;
    const productUpdated = await this.productRepository.updateImage(
      command.id,
      imageUrl,
    );

    return PrismaProductMapper.toResponse(productUpdated);
  }
}
