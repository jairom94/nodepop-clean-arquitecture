import { NextFunction, Request, Response } from "express";
import { LogoutHandler } from "./logoutHandler.js";

export class LogoutController {
    constructor(private readonly handler: LogoutHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            const authorization = req.headers.authorization;
            const token = authorization?.startsWith("Bearer ")
                ? authorization.slice("Bearer ".length)
                : req.body?.token;
            await this.handler.execute({ token });
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
