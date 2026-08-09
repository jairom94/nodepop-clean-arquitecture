export type TokenType = "access" | "refresh";

export interface TokenPayload {
  sub: string;
  email: string;
}

export interface ITokenService {
  sign(payload: TokenPayload, type: TokenType): string;
  verify(token: string, type: TokenType): TokenPayload | null;
  getExpiry(token: string): Date | null;
}
