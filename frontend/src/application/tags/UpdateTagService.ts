import type { HttpClient } from "../ports/HttpClient";
import { TagSchema, type TagDto } from "./schemas/TagSchema";

export class UpdateTagService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute(id: number, name: string): Promise<TagDto> {
    const response = await this.httpClient.patch(`/tags/${id}`, { name });
    return TagSchema.parse(response);
  }
}
