import { databaseClient } from "../../../database/prisma/PrismaDatabaseClient.js";
import { ITokenRepository } from "../domain/tokenRepository.js";

export class PrismaTokenRepository implements ITokenRepository {
  async revoke(token: string, expiresAt: Date): Promise<void> {
    await databaseClient.db.revokedToken.create({
      data: { token, expiresAt },
    });
  }

  async isRevoked(token: string): Promise<boolean> {
    const found = await databaseClient.db.revokedToken.findUnique({
      where: { token },
    });
    return found !== null;
  }
}
