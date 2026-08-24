import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { RateLimitError } from "../../../shared/errors/RateLimitError.js";

export interface RateLimitOptions {
  /** Ventana de tiempo en ms (default: 15 min) */
  windowMs?: number;
  /** Máximo de peticiones por ventana por IP (default: 100) */
  max?: number;
  /** Mensaje devuelto al superar el límite */
  message?: string;
}

/**
 * Crea un middleware de rate limiting usando express-rate-limit.
 *
 * Al superar el límite lanza un RateLimitError (HTTP 429), que es capturado
 * por el manejador de errores centralizado de la app y formateado como ApiError.
 *
 * Se incluyen cabeceras estándar RateLimit-* (RFC 9361) para que el cliente
 * pueda consultar el estado del límite.
 */
export function createRateLimiter(options: RateLimitOptions = {}) {
  const { windowMs = 15 * 60 * 1000, max = 100, message } = options;

  return rateLimit({
    windowMs,
    max,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (_req: Request, _res: Response, next: NextFunction) => {
      next(new RateLimitError(message));
    },
  });
}

/**
 * Presets de rate limiting por caso de uso.
 *
 * - login: estricto, protege contra ataques de fuerza bruta sobre /auth/login.
 * - global: límite general para todas las rutas autenticadas.
 */
export const rateLimitPresets = {
  login: () =>
    createRateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 5, // 5 intentos por IP cada 15 min
      message: "Demasiados intentos de inicio de sesión. Inténtalo de nuevo más tarde.",
    }),
  global: () =>
    createRateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // 100 peticiones por IP cada 15 min
      message: "Has realizado demasiadas peticiones. Inténtalo de nuevo más tarde.",
    }),
} as const;
