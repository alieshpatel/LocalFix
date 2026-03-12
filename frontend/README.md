# LocalFix Frontend

A modern, dark-themed React + Vite + Tailwind CSS frontend for the LocalFix local services platform.

## Stack

- **React 18** — UI library
- **Vite** — build tool & dev server
- **Tailwind CSS** — utility-first styling
- **React Router v6** — client-side routing
- **Axios** — HTTP client
- **React Hot Toast** — notifications
- **date-fns** — date formatting
- **Lucide React** — icons

## Pages

| Route | Page | Auth |
|---|---|---|
| `/` | Home — hero, categories, featured services | Public |
| `/services` | Browse & filter services | Public |
| `/services/:id` | Service detail + booking form | Public |
| `/bookings` | User's bookings list | 🔒 Required |
| `/dashboard` | User dashboard with stats | 🔒 Required |
| `/admin` | Admin panel (stats, bookings, users) | 🔒 Admin only |
| `/login` | Sign in | Public |
| `/register` | Create account | Public |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your backend URL

# 3. Start dev server
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL |

## Backend API Contract

The frontend expects these REST endpoints:

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/profile

GET    /api/services           ?q= &category= &sort= &page= &limit=
GET    /api/services/:id
POST   /api/services

GET    /api/bookings            ?status= &limit=
GET    /api/bookings/:id
POST   /api/bookings
PATCH  /api/bookings/:id/status
DELETE /api/bookings/:id

GET    /api/services/:id/reviews
POST   /api/services/:id/reviews

GET    /api/admin/stats
GET    /api/admin/bookings     ?limit=
GET    /api/admin/users        ?limit=
```

All protected routes require `Authorization: Bearer <token>` header.

## Build

```bash
npm run build    # outputs to /dist
npm run preview  # preview production build locally
```
