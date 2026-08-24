export interface TokenStorage {
  getToken(): string | null;
  setToken(token: string): void;
  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  getUser(): string | null;
  setUser(user: string): void;
  clearTokens(): void;
}
