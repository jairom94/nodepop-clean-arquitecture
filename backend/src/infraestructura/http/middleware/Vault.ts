import { NextFunction, Request, Response } from "express";
import { VaultLockedError } from "../../../shared/errors/VaultLockedError.js";

export interface VaultOptions {
  /** Mensaje devuelto al cliente cuando la ruta está cerrada */
  message?: string;
  /** Si es false, la bóveda deja pasar todas las peticiones (default: true) */
  enabled?: boolean;
  /** Peticiones que pueden pasar aunque la bóveda esté activa */
  allow?: (req: Request) => boolean;
}

/**
 * Bóveda: middleware que cierra el acceso a una ruta.
 *
 * Mientras está activa, toda petición que llega a la ruta se corta con un
 * VaultLockedError (HTTP 403), que el manejador de errores centralizado de la
 * app formatea como el resto de errores. No llega a ejecutarse el controlador,
 * así que la petición no consume base de datos, disco ni CPU.
 *
 * @example
 * // Solo lectura: deja pasar los GET y corta el resto
 * router.use(vault({ allow: (req) => req.method === "GET" }));
 */
export function vault(options: VaultOptions = {}) {
  const { message, enabled = true, allow } = options;

  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!enabled || allow?.(req)) {
      next();
      return;
    }
    next(new VaultLockedError(message));
  };
}
