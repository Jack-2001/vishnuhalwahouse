# Progress Document — Vishnu Halwa House (MERN)

## Project purpose
- Build a small MERN website for Vishnu Halwa House showcasing sweets, namkeen, and a live samosa counter.

## Current status
- Initial TODO list created and tracked.
- SVG logo design: in progress (logo file added to `assets/logo.svg`).
- README and run instructions: in progress (see `README.md`).

## Tasks and details

- Design SVG logo: Create an SVG reflecting the attached shop badge (oval, warm brown/gold tones) and add to frontend header.
- Backend scaffold: Express server with Mongoose models for Product, Counter; REST APIs for listing products and updating samosa counter.
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

4. Frontend

```bash
cd frontend
npm install
npm start
```

## Next immediate steps
- Implement backend models and basic APIs (products, counter).
- Build frontend React pages and integrate `assets/logo.svg` into header.
- Add authentication (optional) and admin UI to update products and samosa counter.

## Notes / Decisions
- Use MongoDB + Mongoose for flexible product data (types of sweets, price, stock).
- Keep UI simple and mobile-friendly; use warm color palette to match logo.
