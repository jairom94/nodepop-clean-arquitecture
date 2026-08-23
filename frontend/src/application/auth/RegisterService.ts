import type { HttpClient } from "../ports/HttpClient";
import type { RegisterCredentials } from "./schemas/RegisterCredentialsSchema";
import { RegisterResponseSchema } from "./schemas/RegisterResponseSchema";

export class RegisterService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute(credentials: RegisterCredentials) {
    const response = await this.httpClient.post("/users", credentials);
    const data = RegisterResponseSchema.parse(response);
    return data;
  }
}
