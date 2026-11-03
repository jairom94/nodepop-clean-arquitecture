export interface GetProductCommand {
  id?: number;
  /** Paginación del listado (cuando no hay id). */
  page: number;
  pageSize: number;
}
