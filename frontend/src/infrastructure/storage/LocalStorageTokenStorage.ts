import type { TokenStorage } from "@/application/ports/TokenStorage";

const TOKEN_KEY = "nodepop_access_token";

export class LocalStorageTokenStorage implements TokenStorage {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
