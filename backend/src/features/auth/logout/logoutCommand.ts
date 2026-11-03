export interface LogoutCommand {
  token?: string;
  refreshToken?: string;
  /** Usuario autenticado: solo puede revocar sus propios tokens. */
  requesterId: string;
}
