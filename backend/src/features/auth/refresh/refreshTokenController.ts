import { NextFunction, Request, Response } from "express";
import { RefreshTokenHandler } from "./refreshTokenHandler.js";

export class RefreshTokenController {
    constructor(private readonly handler: RefreshTokenHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            const result = await this.handler.execute(req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
