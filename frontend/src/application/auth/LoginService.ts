import type { HttpClient } from "../ports/HttpClient";
import type { LoginCredentials } from "./schemas/LoginCredentialsSchema";
import { LoginResponseSchema } from "./schemas/LoginResponseSchema";

export class LoginService {
  private readonly httpClient: HttpClient;
  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute(credentials: LoginCredentials) {
    const response = await this.httpClient.post("/auth/login", credentials);
    return LoginResponseSchema.parse(response);
  }
}
