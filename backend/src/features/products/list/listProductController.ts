import { NextFunction, Request, Response } from "express";
import { ListProductHandler } from "./listProductHandler.js";
import { UnauthorizedError } from "../../auth/login/errors/UnauthorizedError.js";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export class ListProductController {
    constructor(private readonly handler: ListProductHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            const ownerId = req.user ? Number(req.user.sub) : undefined;
            if (!ownerId || !Number.isInteger(ownerId) || ownerId <= 0) {
                throw new UnauthorizedError("User not authenticated");
            }

            const rawPage = Number(req.query.page);
            const rawPageSize = Number(req.query.pageSize);

            const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : DEFAULT_PAGE;
            const pageSize = Number.isInteger(rawPageSize) && rawPageSize > 0
                ? Math.min(rawPageSize, MAX_PAGE_SIZE)
                : DEFAULT_PAGE_SIZE;

            const result = await this.handler.execute({ ownerId, page, pageSize });
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
