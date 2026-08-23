import type { HttpClient } from "../ports/HttpClient";
import { CreateProductSchema, ProductSchema, type CreateProductDto, type ProductDto } from "./schemas/ProductSchema";

export class CreateProductService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute(product: CreateProductDto): Promise<ProductDto> {
    const body = CreateProductSchema.parse(product);
    const response = await this.httpClient.post("/products", body);
    return ProductSchema.parse(response);
  }
}
