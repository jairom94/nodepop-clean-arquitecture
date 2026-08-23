import type { HttpClient } from "../ports/HttpClient";
import type { TokenStorage } from "../ports/TokenStorage";

export class LogoutService {
  private readonly httpClient: HttpClient;
  private readonly tokenStorage: TokenStorage;

  constructor(httpClient: HttpClient, tokenStorage: TokenStorage) {
    this.httpClient = httpClient;
    this.tokenStorage = tokenStorage;
  }

  async execute(): Promise<void> {
    try {
      await this.httpClient.post("/auth/logout", {});
    } finally {
      this.tokenStorage.clearToken();
    }
  }
}
