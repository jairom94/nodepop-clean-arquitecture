import type { HttpClient } from "../ports/HttpClient";
import { TagSchema, type TagDto } from "./schemas/TagSchema";

export interface CreateTagInput {
  name: string;
}

export class CreateTagService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute({ name }: CreateTagInput): Promise<TagDto> {
    const response = await this.httpClient.post("/tags", { name });
    return TagSchema.parse(response);
  }
}
