import { NextFunction, Request, Response } from "express";
import { UpdateTagHandler } from "./updateTagHandler.js";

export class UpdateTagController {
    constructor(private readonly handler: UpdateTagHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            const tag = await this.handler.execute({
                id: Number(req.params.id),
                ...req.body,
            });
            res.status(200).json(tag);
        } catch (error) {
            next(error);
        }
    }
}
