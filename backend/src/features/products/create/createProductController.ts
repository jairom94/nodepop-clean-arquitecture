import { NextFunction, Request, Response } from "express";
import { CreateProductHandler } from "./createProductHandler.js";

export class CreateProductController {
    constructor(private readonly handler: CreateProductHandler) {}

    async execute(req:Request,res:Response,next:NextFunction) {
        try {
            const product = await this.handler.execute(req.body);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }
}
