import { databaseClient, PrismaDatabaseClient } from "../../../database/prisma/PrismaDatabaseClient.js";
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
}