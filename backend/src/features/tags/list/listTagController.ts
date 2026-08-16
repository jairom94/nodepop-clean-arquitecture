import { NextFunction, Request, Response } from "express";
import { ListTagHandler } from "./listTagHandler.js";

export class ListTagController {
    constructor(private readonly handler: ListTagHandler) {}

    async execute(_req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.handler.execute();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
