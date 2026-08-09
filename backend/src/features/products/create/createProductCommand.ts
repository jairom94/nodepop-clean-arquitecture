export interface CreateProductCommand {
  name: string;
  price: number;
  ownerId: number;
  image?: string | null;
  tags?: string[];
}
