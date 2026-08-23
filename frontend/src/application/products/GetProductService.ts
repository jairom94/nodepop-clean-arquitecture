import type { HttpClient } from "../ports/HttpClient";
import { ProductSchema, type ProductDto } from "./schemas/ProductSchema";

export class GetProductService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute(id: number): Promise<ProductDto> {
    const response = await this.httpClient.get(`/products/${id}`);
    return ProductSchema.parse(response);
  }
}
