import type { AxiosInstance } from "axios";
import type { TokenStorage } from "../ports/TokenStorage";
import { RefreshTokenResponseSchema } from "./schemas/RefreshTokenResponseSchema";

export class RefreshTokenService {
  private readonly axiosInstance: AxiosInstance;
  private readonly tokenStorage: TokenStorage;

  constructor(axiosInstance: AxiosInstance, tokenStorage: TokenStorage) {
    this.axiosInstance = axiosInstance;
    this.tokenStorage = tokenStorage;
  }

  async execute(): Promise<void> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await this.axiosInstance.post("/auth/refresh", { refreshToken });
    const data = RefreshTokenResponseSchema.parse(response.data);
    this.tokenStorage.setToken(data.token);
    this.tokenStorage.setRefreshToken(data.refreshToken);
  }
}
