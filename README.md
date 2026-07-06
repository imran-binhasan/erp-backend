# Mini ERP — Backend API

Inventory & Sales Management API built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, **Mongoose**, and **JWT**.

> **Live API:** `https://erp-taskb.up.railway.app/api/v1`
> **Swagger Docs:** `https://erp-taskb.up.railway.app/api-docs`
> **Frontend:** `https://erp-taskf.vercel.app`

---

## Quick Start

```bash
git clone <repo-url>
cd backend
cp .env.example .env        # fill in values
npm install --legacy-peer-deps
npm run seed               # seed roles, users, products, sales
npm run dev                # http://localhost:5000
```

## Demo Credentials

| Role | Name | Email | Password |
|------|------|-------|----------|
| Admin | Imran Bin Hasan | admin@example.com | admin123 |
| Manager | Sara Rahman | manager@example.com | manager123 |
| Employee | John Doe | employee@example.com | employee123 |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (tsx watch) |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled server |
| `npm run seed` | Seed database with sample data |
| `npm run lint` | ESLint |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Default 5000 |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Min 32 chars |
| `JWT_EXPIRES_IN` | No | Default `7d` |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `CORS_ORIGIN` | No | Default `http://localhost:5173` |

## API Endpoints

Base path: `/api/v1`

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /auth/login`, `POST /auth/change-password` |
| Products | `GET/POST /products`, `GET/PATCH/DELETE /products/:id` |
| Customers | `GET/POST /customers`, `GET/PATCH/DELETE /customers/:id` |
| Sales | `GET/POST /sales`, `GET /sales/:id` |
| Users | `GET/POST /users`, `GET/PATCH/DELETE /users/:id` |
| Roles | `GET/POST /roles`, `GET/PATCH/DELETE /roles/:id` |
| Dashboard | `GET /dashboard/stats` |

---

## Docker

```bash
docker build -t mini-erp-backend .
docker run -p 5000:5000 \
  -e MONGODB_URI=<your-mongodb-uri> \
  -e JWT_SECRET=<your-secret> \
  -e CLOUDINARY_CLOUD_NAME=... \
  -e CLOUDINARY_API_KEY=... \
  -e CLOUDINARY_API_SECRET=... \
  -e CORS_ORIGIN=https://erp-taskf.vercel.app \
  mini-erp-backend
```

Deployed on **Railway** → `https://erp-taskb.up.railway.app`

---

## Seeder

Run `npm run seed` to populate the database with:

- **3 roles** — Admin, Manager, Employee
- **3 users** — matching the demo credentials above
- **12 customers** — Bangladeshi names and phone numbers
- **30 products** — groceries, dairy, meat, vegetables, spices, snacks, beverages, personal care, electronics
- **~20 sales** — spanning last 7 days

Product images use deterministic placeholders from `picsum.photos`.

---

## Design Decisions

- JWT stored in-memory + localStorage; no httpOnly cookies (assessment scope)
- Soft delete via `deletedAt` with Mongoose pre-hooks
- Sales created inside MongoDB transactions for atomic stock deduction
- Product search uses compound text index + regex fallback
- Price snapshots in sale items for immutable history
- Permissions DB-driven with 60s in-memory cache
