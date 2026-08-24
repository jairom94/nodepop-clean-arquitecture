import type { HttpClient } from "../ports/HttpClient";
import type { TokenStorage } from "../ports/TokenStorage";
import {
  CreateProductSchema,
  ProductSchema,
  type CreateProductDto,
  type ProductDto,
} from "./schemas/ProductSchema";
import { decodeTokenSub } from "@/lib/jwt";

export type CreateProductInput = Omit<CreateProductDto, "ownerId"> & {
  file?: File | null;
};

export class CreateProductService {
  private readonly httpClient: HttpClient;
  private readonly tokenStorage: TokenStorage;

  constructor(httpClient: HttpClient, tokenStorage: TokenStorage) {
    this.httpClient = httpClient;
    this.tokenStorage = tokenStorage;
  }

  async execute(input: CreateProductInput): Promise<ProductDto> {
    const sub = decodeTokenSub(this.tokenStorage.getToken());
    if (sub === null) {
      throw new Error("No hay sesión activa");
    }

    const ownerId = Number(sub);
    const parsed = CreateProductSchema.parse({
      name: input.name,
      price: input.price,
      ownerId,
      tags: input.tags,
    });

    const formData = new FormData();
    formData.append("name", parsed.name);
    formData.append("price", String(parsed.price));
    formData.append("ownerId", String(ownerId));
    if (parsed.tags && parsed.tags.length > 0) {
      formData.append("tags", JSON.stringify(parsed.tags));
    }
    if (input.file) {
      formData.append("image", input.file);
    }

    const response = await this.httpClient.postFormData<ProductDto>(
      "/products",
      formData,
    );
    return ProductSchema.parse(response);
  }
}
