import type { HttpClient } from "../ports/HttpClient";
import { ProductListResponseSchema, type ProductListResponseDto } from "./schemas/ProductSchema";

export interface ListMyProductsParams {
  page?: number;
  pageSize?: number;
}

export class ListMyProductsService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute({ page = 1, pageSize = 10 }: ListMyProductsParams = {}): Promise<ProductListResponseDto> {
    const response = await this.httpClient.get(
      `/products/mine?page=${page}&pageSize=${pageSize}`,
    );
    return ProductListResponseSchema.parse(response);
  }
}
