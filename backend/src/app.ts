import express, { NextFunction, Request, Response, Router } from "express";
import logger from "morgan";
import { ErrorCodes } from "./shared/errors/error-codes.js";
import { AppError } from "./shared/errors/AppError.js";
import apiRouter from "./infraestructura/http/router.js";

const app = express();

// Para JSON
app.use(express.json());
// Para form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(logger("dev"));

const apiVersion = "/api/v1";


app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente.");
});

app.use(apiVersion,apiRouter);

//404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({
    error: "Not Found",
    message: `Path ${req.originalUrl} not found`,
  });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {    
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      cause: err.cause,
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
