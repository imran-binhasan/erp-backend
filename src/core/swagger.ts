import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini ERP - Inventory & Sales Management System API',
      version: '1.0.0',
      description:
        'Backend API for the Mini ERP system. Supports product management, sales with stock deduction, customer management, role-based access control, and dashboard statistics.',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            statusCode: { type: 'integer', example: 400 },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
          required: ['success', 'message', 'statusCode'],
        },
        ApiSuccess: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {},
            message: { type: 'string', example: 'Success' },
            statusCode: { type: 'integer', example: 200 },
          },
          required: ['success', 'data', 'message', 'statusCode'],
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            statusCode: { type: 'integer', example: 200 },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string', example: 'eyJhbGciOi...' },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    role: { type: 'string' },
                    permissions: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
          required: ['success', 'data', 'message', 'statusCode'],
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
        PaginatedUsersResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Users fetched successfully' },
            statusCode: { type: 'integer', example: 200 },
            data: {
              type: 'array',
              items: { type: 'object' },
            },
            meta: { $ref: '#/components/schemas/PaginationMeta' },
          },
          required: ['success', 'data', 'meta', 'message', 'statusCode'],
        },
        Role: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Manager' },
            permissions: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            sku: { type: 'string' },
            category: { type: 'string' },
            purchasePrice: { type: 'number' },
            sellingPrice: { type: 'number' },
            stock: { type: 'integer' },
            imageUrl: { type: 'string' },
            imagePublicId: { type: 'string' },
            deletedAt: { type: ['string', 'null'], format: 'date-time' },
          },
        },
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: ['string', 'null'] },
            phone: { type: ['string', 'null'] },
            deletedAt: { type: ['string', 'null'], format: 'date-time' },
          },
        },
        SaleItem: {
          type: 'object',
          properties: {
            product: { type: 'string' },
            productName: { type: 'string' },
            quantity: { type: 'integer' },
            unitPrice: { type: 'number' },
            subtotal: { type: 'number' },
          },
        },
        Sale: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            customer: { $ref: '#/components/schemas/Customer' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/SaleItem' },
            },
            grandTotal: { type: 'number' },
            createdBy: { $ref: '#/components/schemas/Role' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        DashboardStats: {
          type: 'object',
          properties: {
            totalProducts: { type: 'integer' },
            totalCustomers: { type: 'integer' },
            totalSales: { type: 'integer' },
            lowStockProducts: {
              type: 'array',
              items: { $ref: '#/components/schemas/Product' },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
