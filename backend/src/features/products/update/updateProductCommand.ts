export interface UpdateProductCommand {
  id: number;
  name?: string;
  price?: number;
  image?: string | null;
  tags?: string[];
}
