import bcrypt from "bcrypt";
import { IPasswordHasher } from "../../features/users/domain/PasswordHasher.js";

/** Coste de bcrypt: cada punto duplica el trabajo de un atacante que intente adivinar contraseñas. */
const COST = 12;

export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, COST);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  needsRehash(hash: string): boolean {
    return bcrypt.getRounds(hash) < COST;
  }
}
