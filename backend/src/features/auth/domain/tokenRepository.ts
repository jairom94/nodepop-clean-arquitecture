export interface ITokenRepository {
  /** Revoca el token. Devuelve false si ya estaba revocado (sin lanzar error). */
  revoke(token: string, expiresAt: Date): Promise<boolean>;
  isRevoked(token: string): Promise<boolean>;
  /** Borra los tokens revocados que ya caducaron: no hace falta recordarlos. */
  purgeExpired(): Promise<number>;
}
