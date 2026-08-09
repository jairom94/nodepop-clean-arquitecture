import { PrismaClient } from "@prisma/client/extension";
import { DatabaseClient } from "../DatabaseClient.js";

export class PrismaDatabaseClient implements DatabaseClient{    
    private readonly prisma:PrismaClient = new PrismaClient();

    get db():PrismaClient{
        return this.prisma;
    }

    async connect(){
        await this.prisma.$connect();
    }

    async disconnect(){
        await this.prisma.$disconnect();
    }  
        
}

export const databaseClient = new PrismaDatabaseClient();