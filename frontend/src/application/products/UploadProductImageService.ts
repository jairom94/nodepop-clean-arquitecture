import type { HttpClient } from "../ports/HttpClient";
import { ProductSchema, type ProductDto } from "./schemas/ProductSchema";

export class UploadProductImageService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute(id: number, file: File): Promise<ProductDto> {
    const formData = new FormData();
    formData.append("image", file);
    const response = await this.httpClient.postFormData<ProductDto>(
      `/products/${id}/image`,
      formData,
    );
    return ProductSchema.parse(response);
  }
}
