export interface UpdateUserCommand {
  id: number;
  /** Usuario autenticado (sub del token): solo puede modificarse a sí mismo. */
  requesterId: number;
  name?: string;
  lastname1?: string;
  email?: string;
}
