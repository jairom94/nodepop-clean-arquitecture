import { NextFunction, Request, Response } from "express";
import { UpdateUserHandler } from "./updateUserHandler.js";

export class UpdateUserController {
    constructor(private readonly handler: UpdateUserHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            const user = await this.handler.execute({
                ...req.body,
                id: Number(req.params.id),
                requesterId: Number(req.user?.sub),
            });
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
}
