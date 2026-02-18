# Progress Document — Vishnu Halwa House (MERN)

## Project purpose
- Build a small MERN website for Vishnu Halwa House showcasing sweets, namkeen, and a live samosa counter.

## Current status
- Initial TODO list created and tracked.
- SVG logo design: in progress (logo file added to `assets/logo.svg`).
- README and run instructions: in progress (see `README.md`).
 - Backend scaffold: in progress (Express + Mongoose models and routes added).

## Tasks and details

- Design SVG logo: Create an SVG reflecting the attached shop badge (oval, warm brown/gold tones) and add to frontend header.
- Backend scaffold: Express server with Mongoose models for Product, Counter; REST APIs for listing products and updating samosa counter.
 - Backend scaffold: Express server with Mongoose models for Product, Order, Counter; REST APIs for products, orders, and samosa counter.
- Frontend scaffold: React app with a homepage, product list, and samosa live counter widget.
- Integration: Frontend fetches product list and counter value; counter supports increment/decrement via API.
- Deployment: Prepare Dockerfiles, or deploy to services (Render, Vercel/Heroku + MongoDB Atlas).

## Required tools (install instructions)

- Node.js (recommended LTS v18+). Download: https://nodejs.org/
- npm (bundled with Node) or Yarn
- MongoDB (local) or MongoDB Atlas (cloud). Local: https://www.mongodb.com/try/download/community
- Git: https://git-scm.com/
- VS Code (recommended): https://code.visualstudio.com/

Recommended global npm packages (optional):

```bash
npm install -g nodemon concurrently
```

## Quick setup (development)

1. Clone repo and open terminal.
2. Start MongoDB (local) or set `MONGODB_URI` to an Atlas connection string.
3. Backend

```bash
cd backend
npm install
npm run dev
```

When you run `npm run dev` the server will attempt to connect to MongoDB using `MONGODB_URI` from `.env` (see `backend/.env.example`). Expected output on success:

```
Connected to MongoDB
Server listening on 5000
```

If you see connection errors, make sure MongoDB is running locally or set `MONGODB_URI` to a valid MongoDB Atlas connection string.

4. Frontend

```bash
cd frontend
npm install
npm start
```

## Next immediate steps
- Verify backend: run `npm install` and `npm run dev` in `backend` to confirm server and database connectivity.
- Build frontend React pages and integrate `assets/logo.svg` into header.
- Add authentication (optional) and admin UI to update products and samosa counter.

## Backend work completed (so far)
- `backend/index.js` — Express app and MongoDB connection
- `backend/models/Product.js`, `backend/models/Order.js`, `backend/models/Counter.js`
- `backend/routes/products.js`, `backend/routes/orders.js`, `backend/routes/counter.js`
- `backend/.env.example` and `backend/README.md`

Marking the backend scaffold as in-progress; once you verify the server runs, I'll add admin authentication and tests.

## Notes / Decisions
- Use MongoDB + Mongoose for flexible product data (types of sweets, price, stock).
- Keep UI simple and mobile-friendly; use warm color palette to match logo.
