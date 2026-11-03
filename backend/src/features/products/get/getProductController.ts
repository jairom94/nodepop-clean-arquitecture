import { NextFunction, Request, Response } from "express";
import { GetProductHandler } from "./getProductHandler.js";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export class GetProductController {
    constructor(private readonly handler: GetProductHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            const rawPage = Number(req.query.page);
            const rawPageSize = Number(req.query.pageSize);
            const result = await this.handler.execute({
                id: req.params.id !== undefined ? Number(req.params.id) : undefined,
                page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : DEFAULT_PAGE,
                // Tamaño de página acotado: nadie puede pedir todo el catálogo de una vez
                pageSize: Number.isInteger(rawPageSize) && rawPageSize > 0
                    ? Math.min(rawPageSize, MAX_PAGE_SIZE)
                    : DEFAULT_PAGE_SIZE,
            });
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
