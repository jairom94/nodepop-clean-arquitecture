export interface CreateProductCommand {
  name: string;
  price: number;
  ownerId: number;
  tags?: string[];
  file?: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  };
}
