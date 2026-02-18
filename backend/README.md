# Backend — Vishnu Halwa House

Quick start:

1. Install dependencies

```bash
cd backend
npm install
```

2. Create `.env` from `.env.example` and set `MONGODB_URI`.

3. Run in development:

```bash
npm run dev
```

APIs:
- `GET /api/products` — list products
- `POST /api/products` — create product (admin)
- `PUT /api/products/:id` — update product
- `DELETE /api/products/:id` — delete product
- `POST /api/orders` — place order (body: items [{product, quantity}], customer)
- `GET /api/orders` — list orders
- `GET /api/counter` — get samosa counter
- `POST /api/counter/increment` — increment samosa counter

Authentication:
- A simple JWT-based admin authentication is available under `POST /api/auth`.
- To create the first admin user, set `ADMIN_SECRET` in your `.env` (match `backend/.env.example`) and call:

```
POST /api/auth/register
{ "username": "admin", "password": "strongpass", "adminSecret": "<ADMIN_SECRET>" }
```

Then login to get a token:

```
POST /api/auth/login
{ "username": "admin", "password": "strongpass" }
```

The login response returns `{ token: "..." }`. Use this token in the `Authorization: Bearer <token>` header to call admin-protected endpoints (`POST/PUT/DELETE /api/products`).
