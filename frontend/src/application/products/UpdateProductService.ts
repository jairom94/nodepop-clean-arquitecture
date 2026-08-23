import type { HttpClient } from "../ports/HttpClient";
import {
  ProductSchema,
  UpdateProductSchema,
  type ProductDto,
  type UpdateProductDto,
} from "./schemas/ProductSchema";

export class UpdateProductService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute(id: number, changes: UpdateProductDto): Promise<ProductDto> {
    const body = UpdateProductSchema.parse(changes);
    const response = await this.httpClient.patch(`/products/${id}`, body);
    return ProductSchema.parse(response);
  }
}
