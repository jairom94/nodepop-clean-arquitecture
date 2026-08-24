import { NextFunction, Request, Response } from "express";
import { DeleteProductHandler } from "./deleteProductHandler.js";

export class DeleteProductController {
    constructor(private readonly handler: DeleteProductHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            await this.handler.execute({
                id: Number(req.params.id),
                ownerId: Number(req.user?.sub),
            });
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
