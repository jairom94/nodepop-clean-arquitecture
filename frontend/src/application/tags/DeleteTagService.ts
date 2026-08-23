import type { HttpClient } from "../ports/HttpClient";

export class DeleteTagService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute(id: number): Promise<void> {
    await this.httpClient.delete(`/tags/${id}`);
  }
}
