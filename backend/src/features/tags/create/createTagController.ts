import { NextFunction, Request, Response } from "express";
import { CreateTagHandler } from "./createTagHandler.js";

export class CreateTagController {
    constructor(private readonly handler: CreateTagHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            const { name } = req.body;
            const tag = await this.handler.execute({ name });
            res.status(201).json(tag);
        } catch (error) {
            next(error);
        }
    }
}