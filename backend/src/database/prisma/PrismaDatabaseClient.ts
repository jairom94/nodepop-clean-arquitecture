import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { DatabaseClient } from "../DatabaseClient.js";
import { ENVIRONMENTS } from "../../config/environments.js";

export class PrismaDatabaseClient implements DatabaseClient{    
    private readonly prisma:PrismaClient = new PrismaClient({
        adapter: new PrismaBetterSqlite3({ url: ENVIRONMENTS.databaseUrl })
    });

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