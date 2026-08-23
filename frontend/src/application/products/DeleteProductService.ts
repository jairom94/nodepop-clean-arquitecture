import type { HttpClient } from "../ports/HttpClient";

export class DeleteProductService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute(id: number): Promise<void> {
    await this.httpClient.delete(`/products/${id}`);
  }
}
