import http from 'node:http';
import app from './app.js';
import { ENVIRONMENTS } from './config/environments.js';
import { PrismaTokenRepository } from './features/auth/infraestructura/PrismaTokenRepository.js';

const server = http.createServer(app);

server.listen(ENVIRONMENTS.port, () => {
  console.log(`Servidor escuchando en http://localhost:${ENVIRONMENTS.port}`);
});

// Los tokens revocados solo hace falta recordarlos hasta que caducan
const PURGE_INTERVAL_MS = 60 * 60 * 1000; // cada hora
const tokenRepository = new PrismaTokenRepository();

async function purgeRevokedTokens() {
  try {
    const removed = await tokenRepository.purgeExpired();
    if (removed > 0) console.log(`Tokens revocados caducados eliminados: ${removed}`);
  } catch (error) {
    console.error('No se pudieron limpiar los tokens revocados', error);
  }
}

void purgeRevokedTokens();
// unref: el temporizador no impide que el proceso termine
setInterval(() => void purgeRevokedTokens(), PURGE_INTERVAL_MS).unref();
