export const usersDocs = {
  "/users": {
    post: {
      summary: "Create a new user",
      description: "Creates a new user account. Requires admin role.",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password", "role"],
              properties: {
                name: {
                  type: "string",
                  example: "Jane Doe",
                  description: "User full name (min 2 characters)",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "jane@example.com",
                  description: "User email (must be unique)",
                },
                password: {
                  type: "string",
                  format: "password",
                  example: "Password@123",
                  description:
                    "Password (min 8 chars, uppercase, number, special char)",
                },
                role: {
                  type: "string",
                  enum: ["VIEWER", "ANALYST", "ADMIN"],
                  example: "ANALYST",
                  description: "User role",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  statusCode: { type: "number", example: 201 },
                  message: {
                    type: "string",
                    example: "User created successfully",
                  },
                  data: { $ref: "#/components/schemas/User" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized - No token provided" },
        403: { description: "Forbidden - Admin role required" },
        409: { description: "Conflict - Email already registered" },
      },
    },
    get: {
      summary: "Get all users",
      description:
        "Retrieves a paginated list of all users. Requires admin role.",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "page",
          in: "query",
          schema: { type: "integer", default: 1 },
          description: "Page number for pagination",
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10, maximum: 100 },
          description: "Number of users per page",
        },
      ],
      responses: {
        200: {
          description: "Users retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  statusCode: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "Users retrieved successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      users: {
                        type: "array",
                        items: { $ref: "#/components/schemas/User" },
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          page: { type: "integer", example: 1 },
                          limit: { type: "integer", example: 10 },
                          total: { type: "integer", example: 25 },
                          totalPages: { type: "integer", example: 3 },
                        },
                      },
                    },
                  },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - Admin role required" },
      },
    },
  },
  "/users/{id}": {
    get: {
      summary: "Get user by ID",
      description:
        "Retrieves a specific user by their ID. Requires admin role.",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "User ID",
        },
      ],
      responses: {
        200: {
          description: "User retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  statusCode: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "User retrieved successfully",
                  },
                  data: { $ref: "#/components/schemas/User" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - Admin role required" },
        404: { description: "User not found" },
      },
    },
    patch: {
      summary: "Update user",
      description:
        "Updates user information (name, email, role, isActive). Requires admin role.",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "User ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "Updated Name",
                  description: "User full name (optional)",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "newemail@example.com",
                  description: "User email (optional, must be unique)",
                },
                role: {
                  type: "string",
                  enum: ["VIEWER", "ANALYST", "ADMIN"],
                  example: "ADMIN",
                  description: "User role (optional)",
                },
                isActive: {
                  type: "boolean",
                  example: true,
                  description: "User active status (optional)",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  statusCode: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "User updated successfully",
                  },
                  data: { $ref: "#/components/schemas/User" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - Admin role required" },
        404: { description: "User not found" },
        409: { description: "Email already in use" },
      },
    },
    delete: {
      summary: "Delete user (soft delete)",
      description:
        "Soft deletes a user (marks as deleted, does not remove from database). Requires admin role.",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "User ID",
        },
      ],
      responses: {
        200: {
          description: "User deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  statusCode: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "User deleted successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                    },
                  },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - Admin role required" },
        404: { description: "User not found" },
      },
    },
  },
};
