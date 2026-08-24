import { databaseClient } from "../../../database/prisma/PrismaDatabaseClient.js";
import { Product } from "../domain/Product.js";
import { IProductRepository } from "../domain/productRepository.js";
import { PrismaProductMapper } from "./PrismaProductMapper.js";

export class PrismaProductRepository implements IProductRepository {    

    async create(product: Product): Promise<Product> {
        const created =  await databaseClient.db.product.create({
            data:PrismaProductMapper.toPersistence(product),
            include:{ tags:true }
        })        
        return PrismaProductMapper.toDomain(created);
    }
    async findAll(): Promise<Product[]> {
        const products = await databaseClient.db.product.findMany({
            include:{ tags:true }
        });
        return products.map(product=>PrismaProductMapper.toDomain(product));
    }
    async findById(id: number): Promise<Product | null> {
        const found = await databaseClient.db.product.findUnique({
            where:{id},
            include:{ tags:true }
        });
        if(!found) return null;
        return PrismaProductMapper.toDomain(found);
    }
    async findByOwnerId(ownerId: number, skip?: number, take?: number): Promise<Product[]> {
        const products = await databaseClient.db.product.findMany({
            where:{ ownerId },
            skip,
            take,
            orderBy:{ id: "asc" },
            include:{ tags:true }
        });
        return products.map(product=>PrismaProductMapper.toDomain(product));
    }
    async countByOwnerId(ownerId: number): Promise<number> {
        return databaseClient.db.product.count({
            where:{ ownerId },
        });
    }
    async update(id: number, data: {name:string;price:number;image:string|null;tags:string[]}): Promise<Product> {
        const updated = await databaseClient.db.product.update({
            where:{id},
            data:{
                name: data.name,
                price: data.price,
                image: data.image,
                tags: {
                    set: [],
                    connectOrCreate: data.tags.map((name) => ({
                        where: { name },
                        create: { name },
                    })),
                },
            },
            include:{ tags:true }
        });
        return PrismaProductMapper.toDomain(updated);
    }
    async updateImage(id: number, image: string | null): Promise<Product> {
        const updated = await databaseClient.db.product.update({
            where:{id},
            data:{ image },
            include:{ tags:true }
        });
        return PrismaProductMapper.toDomain(updated);
    }
    async delete(id: number): Promise<void> {
        await databaseClient.db.product.delete({
            where:{ id },
        });
    }
}
