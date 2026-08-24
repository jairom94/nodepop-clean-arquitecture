export interface UpdateProductCommand {
  id: number;
  name?: string;
  price?: number;
  tags?: string[];
}
