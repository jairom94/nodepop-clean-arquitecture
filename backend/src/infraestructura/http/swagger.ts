import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nodepop API",
      version: "1.0.0",
      description: "API de Nodepop: autenticación, usuarios, productos y tags.",
    },
    servers: [
      {
        url: "http://localhost:3005/api/v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiError: {
          type: "object",
          properties: {
            code: { type: "string" },
            message: { type: "string" },
            cause: {
              type: "array",
              items: { type: "object" },
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            refreshToken: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        RefreshTokenRequest: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string" },
          },
        },
        RefreshTokenResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
          },
        },
        LogoutRequest: {
          type: "object",
          properties: {
            token: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            lastname1: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["name", "lastname1", "email", "password"],
          properties: {
            name: { type: "string", maxLength: 50 },
            lastname1: { type: "string", maxLength: 50 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6, maxLength: 100 },
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            name: { type: "string", maxLength: 50 },
            lastname1: { type: "string", maxLength: 50 },
            email: { type: "string", format: "email" },
          },
        },
        Tag: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
          },
        },
        CreateTagRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", maxLength: 50 },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            price: { type: "number" },
            ownerId: { type: "integer" },
            image: { type: "string", format: "url", nullable: true },
            tags: {
              type: "array",
              items: { $ref: "#/components/schemas/Tag" },
            },
          },
        },
        CreateProductRequest: {
          type: "object",
          required: ["name", "price", "ownerId"],
          properties: {
            name: { type: "string", maxLength: 100 },
            price: { type: "number", exclusiveMinimum: 0 },
            ownerId: { type: "integer" },
            image: { type: "string", format: "url", nullable: true },
            tags: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        UpdateProductRequest: {
          type: "object",
          properties: {
            name: { type: "string", maxLength: 100 },
            price: { type: "number", exclusiveMinimum: 0 },
            image: { type: "string", format: "url", nullable: true },
            tags: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        ProductListResponse: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/Product" },
            },
            page: { type: "integer" },
            pageSize: { type: "integer" },
            total: { type: "integer" },
            totalPages: { type: "integer" },
          },
        },
      },
    },
  },
  apis: ["./src/features/**/*Route.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

export function createSwaggerRouter(): Router {
  const router = Router();
  router.use(swaggerUi.serve);
  router.get("/", swaggerUi.setup(swaggerSpec));
  return router;
}
