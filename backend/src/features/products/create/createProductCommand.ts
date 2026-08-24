export interface CreateProductCommand {
  name: string;
  price: number;
  ownerId: number;
  image?: string | null;
  tags?: string[];
  file?: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  };
}
