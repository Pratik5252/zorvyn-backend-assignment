import { authDocs } from "./auth.doc";
import { usersDocs } from "./users.doc";

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Finance Dashboard API",
    version: "1.0.0",
    description: "Finance data processing and access control backend",
  },
  servers: [{ url: "http://localhost:3000/api/v1" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT Bearer token obtained from login/register endpoints",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["VIEWER", "ANALYST", "ADMIN"] },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      FinancialRecord: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          amount: { type: "number", format: "decimal" },
          type: { type: "string", enum: ["INCOME", "EXPENSE"] },
          categoryId: { type: "string", format: "uuid" },
          date: { type: "string", format: "date-time" },
          description: { type: "string" },
          createdBy: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          deletedAt: { type: "string", format: "date-time", nullable: true },
        },
      },
    },
  },
  paths: {
    ...authDocs,
    ...usersDocs,
  },
};
