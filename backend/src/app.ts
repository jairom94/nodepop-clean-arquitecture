import express, { NextFunction, Request, Response, Router } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import { ErrorCodes } from "./shared/errors/error-codes.js";
import { AppError } from "./shared/errors/AppError.js";
import apiRouter from "./infraestructura/http/router.js";
import { ENVIRONMENTS } from "./config/environments.js";

// morgan y swagger son herramientas de desarrollo (devDependencies): se importan
// solo en ese modo, porque la imagen de producción no los instala.
const isDevelopment = ENVIRONMENTS.mode === "development";

const app = express();

// Cabeceras de seguridad. Las imágenes de /uploads se muestran desde el frontend,
// que vive en otro origen: se permite cargarlas entre orígenes (por defecto Helmet lo bloquea).
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// CORS: permite peticiones desde el origen del frontend
app.use(cors({
  origin: ENVIRONMENTS.corsOrigin,
  credentials: true,
}));

// Para JSON
app.use(express.json());
// Para form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Log de peticiones en consola: solo en desarrollo
if (isDevelopment) {
  const { default: logger } = await import("morgan");
  app.use(logger("dev"));
}

// Archivos estáticos: imágenes subidas de productos
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

const apiVersion = "/api/v1";


app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente.");
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(apiVersion,apiRouter);

// Documentación de la API: solo en desarrollo, en producción no se expone el mapa de la API
if (isDevelopment) {
  const { createSwaggerRouter } = await import("./infraestructura/http/swagger.js");
  app.use('/api-doc', createSwaggerRouter());
}

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
      cause: err.expose ? err.cause : undefined,
      stack: ENVIRONMENTS.mode === "development" ? err.stack : undefined,
    });
  }

  const error = err instanceof Error ? err : new Error("Unknown error");
  return res.status(500).json({
    code: ErrorCodes.INTERNAL_ERROR,
    message: "Internal server error",
    stack: ENVIRONMENTS.mode === "development" ? error.stack : undefined,
  });
});

export default app;
