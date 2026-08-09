import { PasswordHasher } from "../../features/users/domain/PasswordHasher.js";
import bcrypt from "bcrypt";

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 7);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}