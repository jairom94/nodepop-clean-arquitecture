import dotenv from 'dotenv';

dotenv.config();

export const ENVIRONMENTS = {
     databaseUrl: process.env.DATABASE_URL || '',
     jwtSecret: process.env.JWT_SECRET || '',
     jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
     jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
     mode: process.env.MODE || 'development'
} as const;