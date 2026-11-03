export interface UpdateTagCommand {
  id: number;
  name: string;
  /** Usuario autenticado: no puede renombrar tags que usan productos de otros. */
  requesterId: number;
}
