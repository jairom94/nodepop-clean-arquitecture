import { AppError } from "./AppError.js";
import { ErrorCodes } from "./error-codes.js";

/**
 * La ruta está cerrada por la bóveda (p. ej. acciones desactivadas en la demo).
 *
 * 403 y no 401: la petición es válida y el usuario puede estar autenticado,
 * pero la acción no está permitida. Un 401 haría creer al cliente que la sesión caducó.
 */
export class VaultLockedError extends AppError {
  readonly code = ErrorCodes.VAULT_LOCKED;
  readonly status = 403;

  constructor(message = "This action is disabled in this demo") {
    super(message, { expose: true });
  }
}
