import type { HttpClient } from "../ports/HttpClient";

export class LoginService {
    private readonly httpClient: HttpClient;
  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async execute(email: string, password: string) {
    return this.httpClient.post('/auth/login', {
      email,
      password,
    });
  }
}