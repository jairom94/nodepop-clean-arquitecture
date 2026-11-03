import { isAxiosError } from "axios";

/** Código que devuelve el backend cuando la bóveda de la demo bloquea una acción. */
const VAULT_LOCKED = "VAULT_LOCKED";

interface ApiErrorBody {
  code?: string;
  message?: string;
}

function errorBody(error: unknown): ApiErrorBody | undefined {
  return isAxiosError<ApiErrorBody>(error) ? error.response?.data : undefined;
}

/** true si la acción la ha bloqueado la demo de solo lectura. */
export function isVaultLocked(error: unknown): boolean {
  return errorBody(error)?.code === VAULT_LOCKED;
}

/** true si el backend devolvió exactamente este código de error. */
export function hasErrorCode(error: unknown, code: string): boolean {
  return errorBody(error)?.code === code;
}

/**
 * Mensaje para el usuario: si la demo bloqueó la acción, el que explica el motivo;
 * en cualquier otro caso, el mensaje propio de esa acción.
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
  return isVaultLocked(error) ? (errorBody(error)?.message ?? fallback) : fallback;
}
