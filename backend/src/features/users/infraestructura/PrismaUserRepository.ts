import { databaseClient } from "../../../database/prisma/PrismaDatabaseClient.js";
import { User } from "../domain/User.js";
import { IUserRepository } from "../domain/userRepository.js";
import { PrismaUserMapper } from "./PrismaUserMapper.js";

export class PrismaUserRepository implements IUserRepository {    

    async create(user: User): Promise<User> {
        const created =  await databaseClient.db.user.create({
            data:PrismaUserMapper.toPersistence(user)
        })        
        return PrismaUserMapper.toDomain(created);
    }
    async findAll(): Promise<User[]> {
        const users = await databaseClient.db.user.findMany();
        return users.map(user => PrismaUserMapper.toDomain(user));
    }
    async findById(id: number): Promise<User | null> {
        const found = await databaseClient.db.user.findUnique({where:{id}});
        if(!found) return null;
        return PrismaUserMapper.toDomain(found);
    }
    async findByEmail(email: string): Promise<User | null> {
        const found = await databaseClient.db.user.findUnique({where:{email}});
        if(!found) return null;
        return PrismaUserMapper.toDomain(found);
    }
    async updatePassword(id: number, passwordHash: string): Promise<void> {
        await databaseClient.db.user.update({ where:{ id }, data:{ password: passwordHash } });
    }
    async update(id: number, data: {name:string;lastname1:string;email:string}): Promise<User> {
        const updated = await databaseClient.db.user.update({
            where:{id},
            data,
        });
        return PrismaUserMapper.toDomain(updated);
    }
}
