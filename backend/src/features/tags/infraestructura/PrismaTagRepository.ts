import { databaseClient } from "../../../database/prisma/PrismaDatabaseClient.js";
import { Tag } from "../domain/Tag.js";
import { ITagRepository } from "../domain/tagRepository.js";
import { PrismaTagMapper } from "./PrismaTagMapper.js";

export class PrismaTagRepository implements ITagRepository {    

    async create(tag: Tag): Promise<Tag> {
        
        const created =  await databaseClient.db.tag.create({
            data:PrismaTagMapper.toPersistence(tag)
        })        
        return PrismaTagMapper.toDomain(created);
    }
    async findAll(): Promise<Tag[]> {
        const tags = await databaseClient.db.tag.findMany();
        return tags.map(tag=>PrismaTagMapper.toDomain(tag));        
    }
    async findById(id: number): Promise<Tag | null> {
        const found = await databaseClient.db.tag.findUnique({where:{id}});
        if(!found) return null;
        return PrismaTagMapper.toDomain(found);
    }
    async findByName(name: string): Promise<Tag | null> {
        const found = await databaseClient.db.tag.findUnique({where:{name}});
        if(!found) return null;
        return PrismaTagMapper.toDomain(found);
    }
    async update(id: number, data: {name:string}): Promise<Tag> {
        const updated = await databaseClient.db.tag.update({
            where:{ id },
            data,
        });
        return PrismaTagMapper.toDomain(updated);
    }
    async isUsedByOtherOwners(id: number, ownerId: number): Promise<boolean> {
        const count = await databaseClient.db.product.count({
            where:{ ownerId:{ not: ownerId }, tags:{ some:{ id } } },
        });
        return count > 0;
    }
    async delete(id: number): Promise<void> {
        await databaseClient.db.tag.delete({
            where:{ id },
        });
    }
}