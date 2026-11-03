export interface DeleteTagCommand {
  id: number;
  /** Usuario autenticado: no puede borrar tags que usan productos de otros. */
  requesterId: number;
}
