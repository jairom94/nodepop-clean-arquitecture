import type { HttpClient } from "@/application/ports/HttpClient";
import type { TokenStorage } from "@/application/ports/TokenStorage";
import type { RefreshTokenService } from "@/application/auth/RefreshTokenService";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { AxiosError } from "axios";

export class AxiosHttpClient implements HttpClient {
  private readonly client: AxiosInstance;
  private readonly tokenStorage: TokenStorage;
  private readonly refreshTokenService: RefreshTokenService;
  private onSessionExpired?: () => void;
  private isRefreshing = false;
  private pendingQueue: Array<(token: string | null) => void> = [];

  constructor(
    client: AxiosInstance,
    tokenStorage: TokenStorage,
    refreshTokenService: RefreshTokenService,
  ) {
    this.client = client;
    this.tokenStorage = tokenStorage;
    this.refreshTokenService = refreshTokenService;

    this.client.interceptors.request.use((config) => {
      const token = tokenStorage.getToken();
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retried?: boolean;
        };

        // No intentar renovar si:
        // - No hay respuesta del servidor (error de red)
        // - No es 401
        // - La petición es al propio endpoint de refresh
        // - Ya se reintentó antes
        const isRefreshCall = originalRequest.url?.includes("/auth/refresh");
        const isLogoutCall = originalRequest.url?.includes("/auth/logout");

        if (
          !error.response ||
          error.response.status !== 401 ||
          isRefreshCall ||
          isLogoutCall ||
          originalRequest._retried
        ) {
          return Promise.reject(error);
        }

        originalRequest._retried = true;

        // Si ya hay una renovación en curso, encolar la petición
        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.pendingQueue.push((token) => {
              if (token) {
                originalRequest.headers.set("Authorization", `Bearer ${token}`);
                resolve(this.client(originalRequest));
              } else {
                reject(error);
              }
            });
          });
        }

        this.isRefreshing = true;

        try {
          await this.refreshTokenService.execute();
          const newToken = this.tokenStorage.getToken();

          // Resolver peticiones pendientes
          this.pendingQueue.forEach((cb) => cb(newToken));
          this.pendingQueue = [];

          if (newToken) {
            originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
          }

          return this.client(originalRequest);
        } catch {
          // La renovación falló: limpiar tokens y notificar
          this.pendingQueue.forEach((cb) => cb(null));
          this.pendingQueue = [];
          this.tokenStorage.clearTokens();
          this.onSessionExpired?.();
          return Promise.reject(error);
        } finally {
          this.isRefreshing = false;
        }
      },
    );
  }

  setOnSessionExpired(callback: () => void): void {
    this.onSessionExpired = callback;
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  async post<T, B>(url: string, body: B): Promise<T> {
    const response = await this.client.post<T>(url, body);
    return response.data;
  }

  async postFormData<T>(url: string, data: FormData): Promise<T> {
    const response = await this.client.post<T>(url, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
