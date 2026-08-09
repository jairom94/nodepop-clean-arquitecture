import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import { ErrorCodes } from "./shared/errors/error-codes.js";
import { AppError } from "./shared/errors/AppError.js";

const app = express();

app.use(express.json());

app.use(logger("dev"));

const apiVersion = "/api/v1";

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente.");
});

//404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({
    error: "Not Found",
    message: `Path ${req.originalUrl} not found`,
  });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    // if (req.url.startsWith("/api")) {
    // }
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      stack: err.stack,
    });
  }

  const error = err instanceof Error ? err : new Error("Unknown error");
  return res.status(500).json({
    code: ErrorCodes.INTERNAL_ERROR,
    message: "Internal server error",
    stack: error.stack,
  });
});

export default app;
