import { NextFunction, Request, Response } from "express";
import { GetProductHandler } from "./getProductHandler.js";

export class GetProductController {
    constructor(private readonly handler: GetProductHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            const result = await this.handler.execute({
                id: req.params.id !== undefined ? Number(req.params.id) : undefined,
            });
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
