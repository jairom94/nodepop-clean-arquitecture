import { NextFunction, Request, Response } from "express";
import { UpdateProductHandler } from "./updateProductHandler.js";

export class UpdateProductController {
    constructor(private readonly handler: UpdateProductHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            const product = await this.handler.execute({
                id: Number(req.params.id),
                ...req.body,
                ownerId: Number(req.user?.sub),
            });
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }
}
