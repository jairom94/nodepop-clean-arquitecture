import { NextFunction, Request, Response } from "express";
import { DeleteTagHandler } from "./deleteTagHandler.js";

export class DeleteTagController {
    constructor(private readonly handler: DeleteTagHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            await this.handler.execute({
                id: Number(req.params.id),
                requesterId: Number(req.user?.sub),
            });
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
