import type { HttpClient } from "../ports/HttpClient";
import { UpdateUserSchema, type UpdateUserDto } from "./schemas/UpdateUserSchema";
import { RegisterResponseSchema, type RegisterResponseDto } from "./schemas/RegisterResponseSchema";

export class UpdateUserService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute(id: number, changes: UpdateUserDto): Promise<RegisterResponseDto> {
    const body = UpdateUserSchema.parse(changes);
    const response = await this.httpClient.patch<RegisterResponseDto, typeof body>(`/users/${id}`, body);
    return RegisterResponseSchema.parse(response);
  }
}
