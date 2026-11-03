export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly status: number;
  /** Si es true, el detalle (cause) puede enviarse al cliente. */
  readonly expose: boolean;

  constructor(message: string,options?:{
    cause?:unknown,
    expose?:boolean
  }) {
    super(message,{cause:options?.cause});
    this.expose = options?.expose ?? false;
  }
}
