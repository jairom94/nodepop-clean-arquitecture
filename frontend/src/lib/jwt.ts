export interface DecodedToken {
  sub?: string;
  email?: string;
}

/**
 * Decodifica el payload de un JWT (parte intermedia en base64url).
 * No valida la firma: el backend la valida; solo lectura del contenido.
 */
export function decodeToken(token: string | null): DecodedToken | null {
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "="));
    return JSON.parse(json) as DecodedToken;
  } catch {
    return null;
  }
}

export function decodeTokenSub(token: string | null): string | null {
  return decodeToken(token)?.sub ?? null;
}
