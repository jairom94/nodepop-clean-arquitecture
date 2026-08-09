export interface ITokenRepository {
  revoke(token: string, expiresAt: Date): Promise<void>;
  isRevoked(token: string): Promise<boolean>;
}
