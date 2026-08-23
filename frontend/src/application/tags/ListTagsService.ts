import type { HttpClient } from "../ports/HttpClient";
import { TagSchema, type TagDto } from "./schemas/TagSchema";
import { z } from "zod";

export class ListTagsService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute(): Promise<TagDto[]> {
    const response = await this.httpClient.get("/tags");
    return z.array(TagSchema).parse(response);
  }
}
