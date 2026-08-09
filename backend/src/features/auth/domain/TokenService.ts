export interface ITokenService {
  sign(payload: {
    sub: string;
    email: string;
  }): string;
  getExpiry(token: string): Date | null;
}