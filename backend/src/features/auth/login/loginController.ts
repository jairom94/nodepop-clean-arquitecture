import { NextFunction, Request, Response } from "express";
import { LoginHandler } from "./loginHandler.js";

export class LoginController {
    constructor(private readonly handler: LoginHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            const result = await this.handler.execute(req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
