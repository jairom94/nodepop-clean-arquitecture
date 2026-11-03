import type { HttpClient } from "../ports/HttpClient";
import { ProductListResponseSchema, type ProductListResponseDto } from "./schemas/ProductSchema";

export interface ListProductsParams {
  page?: number;
  pageSize?: number;
}

/** Listado paginado de todos los productos (GET /products). */
export class ListProductsService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute({
    page = 1,
    pageSize = 10,
  }: ListProductsParams = {}): Promise<ProductListResponseDto> {
    const response = await this.httpClient.get(`/products?page=${page}&pageSize=${pageSize}`);
    return ProductListResponseSchema.parse(response);
  }
}
