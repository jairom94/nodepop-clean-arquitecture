import type { HttpClient } from "../ports/HttpClient";
import { z } from "zod";
import { ProductSchema, type ProductDto } from "./schemas/ProductSchema";

export class ListProductsService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute(): Promise<ProductDto[]> {
    const response = await this.httpClient.get("/products");
    return z.array(ProductSchema).parse(response);
  }
}
