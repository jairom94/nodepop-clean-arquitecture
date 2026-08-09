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
        // const tags = await databaseClient.client.tag.findMany();
        // return tags.map(tag=>new Tag({id:tag.id,name:tag.name}));
        return [];
    }
    async findById(id: number): Promise<Tag | null> {
        const found = await databaseClient.db.tag.findUnique({where:{id}});
        if(!found) return null;
        return new Tag({id:found.id,name:found.name});
    }
}