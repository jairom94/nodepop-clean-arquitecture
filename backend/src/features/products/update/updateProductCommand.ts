export interface UpdateProductCommand {
  id: number;
  ownerId: number;
  name?: string;
  price?: number;
  tags?: string[];
}
