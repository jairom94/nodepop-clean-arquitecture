export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly status: number;

  constructor(message: string,options?:{
    cause?:unknown,
    expose?:boolean
  }) {
    super(message,{cause:options?.cause});
  }
}