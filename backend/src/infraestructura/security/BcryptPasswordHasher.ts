
import bcrypt from "bcrypt";
import { IPasswordHasher } from "../../features/users/domain/PasswordHasher.js";

export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 7);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}