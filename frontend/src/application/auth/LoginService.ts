import type { HttpClient } from "../ports/HttpClient";
import type { TokenStorage } from "../ports/TokenStorage";
import type { LoginCredentials } from "./schemas/LoginCredentialsSchema";
import { LoginResponseSchema } from "./schemas/LoginResponseSchema";

export class LoginService {
  private readonly httpClient: HttpClient;
  private readonly tokenStorage: TokenStorage;

  constructor(httpClient: HttpClient, tokenStorage: TokenStorage) {
    this.httpClient = httpClient;
    this.tokenStorage = tokenStorage;
  }

  async execute(credentials: LoginCredentials) {
    const response = await this.httpClient.post("/auth/login", credentials);
    const data = LoginResponseSchema.parse(response);
    this.tokenStorage.setToken(data.token);
    return data;
  }
}
