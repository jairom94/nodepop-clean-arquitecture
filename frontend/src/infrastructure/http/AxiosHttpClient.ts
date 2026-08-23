import type { HttpClient } from "@/application/ports/HttpClient";
import type { TokenStorage } from "@/application/ports/TokenStorage";
import type { AxiosInstance } from "axios";

export class AxiosHttpClient implements HttpClient {
  private readonly client: AxiosInstance;

  constructor(client: AxiosInstance, tokenStorage: TokenStorage) {
    this.client = client;

    this.client.interceptors.request.use((config) => {
      const token = tokenStorage.getToken();
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    });
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  async post<T, B>(url: string, body: B): Promise<T> {
    const response = await this.client.post<T>(url, body);
    return response.data;
  }

  async patch<T, B>(url: string, body: B): Promise<T> {
    const response = await this.client.patch<T>(url, body);
    return response.data;
  }

  async delete(url: string): Promise<void> {
    await this.client.delete(url);
  }
}
