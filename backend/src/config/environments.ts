import dotenv from 'dotenv';

dotenv.config();

const MIN_SECRET_LENGTH = 32;

/**
 * Un secreto JWT débil permite fabricar tokens de cualquier usuario,
 * así que el servidor no arranca sin uno largo y propio para cada tipo de token.
 */
function requireSecret(name: string): string {
     const value = process.env[name];
     if (!value || value.length < MIN_SECRET_LENGTH) {
          throw new Error(
               `${name} debe tener al menos ${MIN_SECRET_LENGTH} caracteres aleatorios. ` +
               `Genera uno con: openssl rand -base64 48`,
          );
     }
     return value;
}

const jwtSecret = requireSecret('JWT_SECRET');
const jwtRefreshSecret = requireSecret('JWT_REFRESH_SECRET');

if (jwtSecret === jwtRefreshSecret) {
     throw new Error('JWT_SECRET y JWT_REFRESH_SECRET deben ser distintos');
}

export const ENVIRONMENTS = {
     port: Number(process.env.PORT) || 3005,
     databaseUrl: process.env.DATABASE_URL || '',
     jwtSecret,
     jwtRefreshSecret,
     jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
     jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
     // Sin MODE explícito se asume producción: nunca se envían trazas por omisión
     mode: process.env.MODE || 'production',
     corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
     // Demo pública de solo lectura: la bóveda corta registros y escrituras
     demoMode: process.env.DEMO_MODE === 'true',
} as const;
