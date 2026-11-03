import { databaseClient } from "../../../database/prisma/PrismaDatabaseClient.js";
import { ITokenRepository } from "../domain/tokenRepository.js";

/** Prisma señala con P2002 una violación de clave única: el token ya estaba revocado. */
function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "P2002";
}

export class PrismaTokenRepository implements ITokenRepository {
  async revoke(token: string, expiresAt: Date): Promise<boolean> {
    try {
      await databaseClient.db.revokedToken.create({
        data: { token, expiresAt },
      });
      return true;
    } catch (error) {
      if (isUniqueViolation(error)) return false;
      throw error;
    }
  }

  async isRevoked(token: string): Promise<boolean> {
    const found = await databaseClient.db.revokedToken.findUnique({
      where: { token },
    });
    return found !== null;
  }

  async purgeExpired(): Promise<number> {
    const { count } = await databaseClient.db.revokedToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return count;
  }
}
