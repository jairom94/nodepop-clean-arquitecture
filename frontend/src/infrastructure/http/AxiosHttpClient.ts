import type { HttpClient } from "@/application/ports/HttpClient";
import type { AxiosInstance } from "axios";

export class AxiosHttpClient implements HttpClient {
  private readonly client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  async post<T, B>(url: string, body: B): Promise<T> {
    const response = await this.client.post<T>(url, body);
    return response.data;
  }
}