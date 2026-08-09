import { NextFunction, Request, Response } from "express";
import { CreateUserHandler } from "./createUserHandler.js";

export class CreateUserController {
    constructor(private readonly handler: CreateUserHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            const user = await this.handler.execute(req.body);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }
}
