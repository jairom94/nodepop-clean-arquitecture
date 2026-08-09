import { User } from "../domain/User.js";
import { User as PrismaUser } from "../../../generated/prisma/client.js";

export class PrismaUserMapper {
  static toDomain(model: PrismaUser): User {
    return new User({
      id: model.id,
      name: model.name,
      lastname1: model.lastname1,
      email: model.email,
      password: model.password,
    });
  }

  static toPersistence(user: User) {
    return {
      name: user.name,
      lastname1: user.lastname1,
      email: user.email,
      password: user.password,
    };
  }
}
