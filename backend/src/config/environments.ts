import dotenv from 'dotenv';

dotenv.config();

export const ENVIRONMENTS = {
     databaseUrl: process.env.DATABASE_URL || ''
} as const;