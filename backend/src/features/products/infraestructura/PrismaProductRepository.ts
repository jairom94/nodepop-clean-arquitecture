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
    async findByOwnerId(ownerId: number): Promise<Product[]> {
        const products = await databaseClient.db.product.findMany({
            where:{ ownerId },
            include:{ tags:true }
        });
        return products.map(product=>PrismaProductMapper.toDomain(product));
    }
}
