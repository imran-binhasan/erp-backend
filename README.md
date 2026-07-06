# Mini ERP — Backend API

Inventory & Sales Management API built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, **Mongoose**, and **JWT**.

> **API Base Path:** `/api/v1`
> **API Docs:** `/api-docs`

---

## Features

- **JWT Authentication** — login with email/password, token-based protected routes, change-password endpoint
- **RBAC** — Admin, Manager, Employee roles with granular DB-driven permissions
- **Products** — full CRUD with Cloudinary image upload, search (text-indexed), pagination
- **Sales** — multi-item sale creation with transaction-safe stock deduction, oversell prevention, auto grand total, immutable history
- **Customers** — full CRUD with soft delete
- **Users** — full CRUD with role assignment
- **Roles** — full CRUD with dynamic permission sets
- **Dashboard** — aggregate stats (total products, customers, sales, low-stock alerts)
- **Real-time** — Socket.io pushes `stock-updated` and `low-stock-alert` events
- **Validation** — Zod schemas on all mutation endpoints, consistent API envelope
- **Swagger** — interactive docs at `/api-docs`
- **Permission Cache** — in-memory 60s TTL reduces DB hits for role lookups

---

## Folder Structure

```
src/
├── core/
│   ├── middleware/        # auth, permission, validate, upload, errorHandler, rateLimiter, requestLogger
│   ├── socket/            # Socket.io server
│   ├── swagger.ts         # OpenAPI 3.0 spec
│   ├── app.ts             # Express app setup
│   ├── db.ts              # MongoDB connection
│   └── server.ts          # HTTP server + graceful shutdown
├── modules/
│   ├── auth/              # Login + change-password (controller, service, validation, routes)
│   ├── product/           # Full CRUD (controller, service, model, validation, routes)
│   ├── customer/          # Full CRUD (controller, service, model, validation, routes)
│   ├── sale/              # Create + List (controller, service, model, validation, routes)
│   ├── dashboard/         # Aggregated stats (controller, service, routes)
│   ├── user/              # Full CRUD (controller, service, model, validation, routes)
│   └── role/              # Full CRUD with dynamic permission sets (controller, service, model, validation, routes)
├── shared/
│   ├── constants/         # HTTP status codes, permission constants + default role mappings
│   ├── errors/            # AppError classes (NotFound, BadRequest, Unauthorized, etc.)
│   ├── types/             # AuthUser, JwtPayload, common types
│   └── utils/             # asyncHandler, ApiResponse, jwt, password, cloudinary, queryBuilder, permissionCache
├── routes/
│   └── index.ts           # Route aggregator
├── types/                 # Express type augmentation
└── env.ts                 # Zod-validated environment config
```

---

## Quick Start

```bash
git clone <repo-url>
cd backend
npm install
cp .env.example .env   # fill in MongoDB URI, JWT secret, Cloudinary creds
npm run seed            # seeds roles + demo users
npm run dev             # http://localhost:5000
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Manager | manager@example.com | manager123 |
| Employee | employee@example.com | employee123 |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with watch |
| `npm run build` | Type-check + compile to `dist/` |
| `npm run start` | Run compiled server |
| `npm run seed` | Seed roles + demo users |
| `npm run lint` | ESLint |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Default 5000 |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Min 32 characters |
| `JWT_EXPIRES_IN` | No | Default `7d` |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `CORS_ORIGIN` | No | Default `http://localhost:5173` |

## API Overview

Base path: `/api/v1`

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /auth/login` |
| Products | `GET/POST /products`, `GET/PATCH/DELETE /products/:id` |
| Customers | `GET/POST /customers`, `GET/PATCH/DELETE /customers/:id` |
| Sales | `GET/POST /sales`, `GET /sales/:id` |
| Users | `GET/POST /users`, `GET/PATCH/DELETE /users/:id` |
| Roles | `GET/POST /roles`, `GET/PATCH/DELETE /roles/:id` |
| Dashboard | `GET /dashboard/stats` |

Full interactive docs at `/api-docs` (Swagger).

## Design Decisions

- **Money** stored as `Number` (float) — documented tradeoff for assessment scope
- **Soft delete** via `deletedAt` timestamp with Mongoose pre-hooks
- **Sales** created inside MongoDB transactions for atomic stock deduction
- **Product search** uses compound text index on `name` + `category`
- **Price snapshots** in sale items (`productName`, `unitPrice`) for immutable history
- **Permissions** DB-driven with 60s in-memory cache
