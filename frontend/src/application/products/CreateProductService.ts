import type { HttpClient } from "../ports/HttpClient";
import type { TokenStorage } from "../ports/TokenStorage";
import {
  CreateProductSchema,
  ProductSchema,
  type CreateProductDto,
  type ProductDto,
} from "./schemas/ProductSchema";
import { decodeTokenSub } from "@/lib/jwt";

export type CreateProductInput = Omit<CreateProductDto, "ownerId">;

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

    const body = CreateProductSchema.parse({ ...input, ownerId: Number(sub) });
    const response = await this.httpClient.post("/products", body);
    return ProductSchema.parse(response);
  }
}
