	import type { TokenStorage } from "@/application/ports/TokenStorage";

	const TOKEN_KEY = "nodepop_access_token";
	const REFRESH_TOKEN_KEY = "nodepop_refresh_token";
	const USER_KEY = "nodepop_user";

	export class LocalStorageTokenStorage implements TokenStorage {
	  getToken(): string | null {
	    return localStorage.getItem(TOKEN_KEY);
	  }

	  setToken(token: string): void {
	    localStorage.setItem(TOKEN_KEY, token);
	  }

	  getRefreshToken(): string | null {
	    return localStorage.getItem(REFRESH_TOKEN_KEY);
	  }

	  setRefreshToken(token: string): void {
	    localStorage.setItem(REFRESH_TOKEN_KEY, token);
	  }

	  getUser(): string | null {
	    return localStorage.getItem(USER_KEY);
	  }

	  setUser(user: string): void {
	    localStorage.setItem(USER_KEY, user);
	  }

	  clearTokens(): void {
	    localStorage.removeItem(TOKEN_KEY);
	    localStorage.removeItem(REFRESH_TOKEN_KEY);
	    localStorage.removeItem(USER_KEY);
	  }
	}
