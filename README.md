<div align="center">

# 🏨 Delhi Line Hotel

**A full-stack luxury hotel website** — room browsing & booking, dining reservations, an admin dashboard, and a mock payment flow, built on the MERN stack.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_4-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-Unspecified-lightgrey?style=flat-square)]()

[Overview](#-overview) •
[Features](#-features) •
[Tech Stack](#-tech-stack) •
[Architecture](#-architecture) •
[Getting Started](#-getting-started) •
[API Reference](#-api-reference)

</div>

---

## 📖 Overview

**Delhi Line Hotel** is a complete hotel website built to feel like a real luxury property's online presence — a marketing homepage, a room catalog with tiered pricing, a dining reservation system, and an authenticated booking flow, all backed by an admin dashboard for managing the property.

The project was built to practice a production-shaped full-stack architecture: JWT authentication, role-based admin access, rate limiting, dynamic pricing logic, and a payment flow — end to end, frontend to database.

## ✨ Features

| | |
|---|---|
| 🛏️ **Room Catalog** | Three tiers (Classic / Executive / Royal Suite), each with amenities, images, wing, and max occupancy |
| 💸 **Dynamic Pricing** | Per-room weekend and seasonal price multipliers applied on top of base nightly rate |
| 📅 **Booking Flow** | Date-range selection (`react-day-picker`), guest count, arrival time & special preferences (dietary, airport transfer, quiet room) |
| 🍽️ **Dining Reservations** | Table booking by date, time, and party size, independent of room bookings |
| 🔐 **JWT Authentication** | bcrypt-hashed passwords, refresh token support, guest checkout also supported (bookings don't require an account) |
| 🛡️ **Admin Dashboard** | Role-gated (`isAdmin` middleware) management of rooms, bookings, dining, and gallery content |
| 🖼️ **Cloudinary-Backed Gallery** | Categorized property images (Architecture / Interiors / Culinary Art / Moments) |
| ⭐ **Reviews** | One review per completed booking, enforced via a unique index |
| 💳 **Payment Flow** | Razorpay-shaped order-creation & verification endpoints (currently mocked — see note below) |
| 🚦 **Rate Limiting** | API-wide rate limiter to blunt abuse |
| ✨ **Animated UI** | Framer Motion transitions throughout the booking and browsing experience |

> **Note on payments:** the current `paymentController` generates mock Razorpay order IDs and skips real HMAC signature verification (the verification code is present but commented out). This is intentional for demo/dev purposes — see [Getting Started](#-getting-started) for what's needed to go live.

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- React 19 + Vite
- Tailwind CSS 3 (`@tailwindcss/forms`)
- Zustand — state management
- TanStack Query — server state / data fetching
- React Router 6
- Framer Motion — animations
- React Day Picker — date selection
- Axios, Zod (validation), react-helmet-async (SEO)

</td>
<td valign="top" width="50%">

**Backend**
- Node.js + Express 4 (ESM)
- MongoDB + Mongoose 8
- JWT (jsonwebtoken) + bcryptjs
- Zod — request validation
- express-rate-limit
- compression, cookie-parser, cors
- Cloudinary (image hosting, gallery)
- Razorpay-shaped payment endpoints

</td>
</tr>
</table>

## 🏗️ Architecture

```
HOTEL-WEB/
├── server/
│   └── src/
│       ├── config/            # MongoDB connection
│       ├── controllers/       # auth, rooms, dining, bookings, admin, payments
│       ├── middleware/        # JWT auth, isAdmin guard, error handler, rate limiter
│       ├── models/            # User, Room, Booking, DiningReservation,
│       │                      # Review, MenuItem, GalleryImage
│       ├── routes/            # Express route definitions
│       ├── scripts/seed.js    # Auto-seeds data on server start
│       └── index.js           # App entry point (serves client/dist in production)
│
└── client/
    └── src/
        ├── components/        # Reusable UI components
        ├── layouts/           # Page layout wrappers
        ├── hooks/             # Custom React hooks
        ├── services/          # API service layer (Axios)
        ├── store/             # Zustand store
        └── pages/             # HomePage, RoomsPage, BookingPage, DiningPage,
                                # GalleryPage, LoginPage, RegisterPage, AdminDashboard
```

<details>
<summary><strong>💡 Design decisions worth knowing</strong></summary>
<br>

- **Guest checkout support** — `Booking.user` is optional; a `guestInfo` sub-object (name/email/phone) is used instead when a booking is made without an account, so the site doesn't force registration to book a room.
- **Auto-seeding on server start** — `index.js` imports and runs `seedData()` on every boot, guaranteeing the app always has demo rooms, menu items, and gallery content without a manual seed step.
- **Dynamic pricing via multipliers** — rather than storing per-date prices, each `Room` carries a `weekendMultiplier` and `seasonalMultiplier` applied to `pricePerNight` at booking time, keeping pricing logic centralized and easy to tune.
- **Review integrity via booking-linked uniqueness** — `Review` requires a `booking` reference and enforces a unique index on it, so a guest can't submit multiple reviews for the same stay.
- **Single deploy target in production** — in production mode, Express serves the built React app directly from `client/dist` and falls back to `index.html` for client-side routing, so the whole app ships as one deployable service.

</details>

## 🚀 Getting Started

### Prerequisites

- Node.js `v20.19.0+`
- MongoDB (local instance or MongoDB Atlas)
- A Cloudinary account (for gallery image uploads)
- A Razorpay account (only if wiring up real payments — see note above)

### 1. Clone the repository

```bash
git clone https://github.com/aniket-123468/HOTEL-WEB.git
cd HOTEL-WEB
```

### 2. Install dependencies (root script installs both)

```bash
npm install
```

This runs `npm --prefix server install` and `npm --prefix client install` automatically.

### 3. Configure environment variables

Create a `.env` file inside `server/`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/delhi-line-hotel
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 4. Run in development

Backend:
```bash
cd server
npm run dev
```

Frontend (separate terminal):
```bash
cd client
npm run dev
```

Frontend runs at `http://localhost:5173`, API at `http://localhost:5000`.

### 5. Production build

```bash
npm run build   # builds the client
npm start        # serves the API + built client from one process
```

## 📡 API Reference

<details>
<summary><strong>Click to expand full endpoint list</strong></summary>
<br>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create an account |
| `POST` | `/api/auth/login` | Public | Log in |
| `GET` | `/api/rooms` | Public | List all rooms |
| `GET` | `/api/rooms/:id` | Public | Room details |
| `GET` | `/api/dining` | Public | List menu items |
| `POST` | `/api/dining` | Public | Create a dining reservation |
| `POST` | `/api/bookings` | Public | Create a booking (account or guest) |
| `GET` | `/api/bookings` | Authenticated | Get current user's bookings |
| `POST` | `/api/payments/create-order` | Public | Create a (mock) Razorpay order |
| `POST` | `/api/payments/verify` | Public | Verify payment & confirm booking |
| `GET / POST / PUT / DELETE` | `/api/admin/*` | Admin only | Manage rooms, bookings, dining, gallery |

</details>

## 🗺️ Roadmap

- [ ] Real Razorpay signature verification (currently mocked)
- [ ] Email confirmations for bookings and dining reservations
- [ ] Multi-property / multi-location support
- [ ] Guest review moderation in the admin dashboard

## 📄 License

This project does not currently specify a license. Contact the repository owner for usage permissions.

---

<div align="center">

Built by [Aniket](https://github.com/aniket-123468)

</div>  