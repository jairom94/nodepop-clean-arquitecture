import { NextFunction, Request, Response } from "express";
import { UpdateTagHandler } from "./updateTagHandler.js";

export class UpdateTagController {
    constructor(private readonly handler: UpdateTagHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            const tag = await this.handler.execute({
                ...req.body,
                id: Number(req.params.id),
                requesterId: Number(req.user?.sub),
            });
            res.status(200).json(tag);
        } catch (error) {
            next(error);
        }
    }
}
