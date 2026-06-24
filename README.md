# 🎬 Movie Reservation System

A full-stack Movie Reservation System backend built with Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, Socket.IO, Razorpay, Nodemailer and PDF ticket generation.

---

# Features

## Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Role Based Access (Admin/User)

---

## Movies
- Add Movie
- Update Movie
- Delete Movie
- Get All Movies
- Get Movie By ID

---

## Theatre Management
- Create Theatre
- View Theatres

---

## Screen Management
- Create Screen
- View Screens

---

## Showtimes
- Create Showtime
- Get Showtimes
- Showtime Price Management

---

## Seat Management
- Generate Seats Automatically
- View Seats By Screen
- Seat Categories
    - Silver
    - Gold
    - Platinum

---

## Reservation System
- Create Reservation
- Cancel Reservation
- Get Reservation Details
- Get User Reservations
- Available Seats API

---

## Redis Seat Locking
- Prevents double booking
- Locks seats temporarily
- Automatic unlock after timeout

---

## Real-Time Updates
Implemented using Socket.IO

Events:
- join-showtime
- seat-locked
- seat-booked
- seat-unlocked
- payment-confirmed

---

## Payment Gateway
Integrated with Razorpay

Features:
- Create Order
- Verify Payment Signature
- Payment Confirmation

---

## Ticket Generation
PDF Ticket Generation using PDFKit

Ticket contains:
- Movie Name
- Theatre Name
- Showtime
- Reservation ID
- QR Code

---

## Email Service
Nodemailer + Gmail SMTP

Automatically sends:
- Booking Confirmation
- Ticket PDF Attachment

---

# Tech Stack

### Backend
- Node.js
- Express
- TypeScript

### Database
- PostgreSQL
- Prisma ORM

### Caching
- Redis

### Real-time Communication
- Socket.IO

### Payments
- Razorpay

### Email
- Nodemailer

### PDF Generation
- PDFKit

### QR Code
- qrcode

---

# Project Structure

```
server
│
├── prisma
│     schema.prisma
│
├── src
│     ├── config
│     ├── controllers
│     ├── middleware
│     ├── routes
│     ├── socket
│     ├── types
│     ├── utils
│     ├── validators
│     ├── app.ts
│     └── server.ts
│
├── tickets
├── package.json
└── tsconfig.json
```

---

# Installation

Clone repository

```bash
git clone <repository-url>
cd movie-reservation-system
```

Install dependencies

```bash
npm install
```

---

# Environment Variables

Create `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/movie_booking"

JWT_SECRET=supersecretjwtkey

PORT=5000

REDIS_URL=redis://localhost:6379

RAZORPAY_KEY_ID=rzp_test_SzQTF8ehOCCPTc
RAZORPAY_KEY_SECRET=WoQInqjf0nYVDlY0APG1qHz9

EMAIL_USER=abhinavbollagani528@gmail.com
EMAIL_PASS=umsftmzdfssdgpwg
```

---

# Database Setup

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Open Prisma Studio

```bash
npx prisma studio
```

---

# Redis Setup

Using Docker

```bash
docker run -d -p 6379:6379 --name movie-redis redis
```

Verify

```bash
docker ps
```

---

# Start Server

Development

```bash
npm run dev
```

Build

```bash
npm run build
```

Production

```bash
npm start
```

---

# API Routes

## Authentication

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

---

## Movies

```
GET /api/movies
GET /api/movies/:id
POST /api/movies
PUT /api/movies/:id
DELETE /api/movies/:id
```

---

## Theatre

```
GET /api/theatres
POST /api/theatres
```

---

## Screen

```
GET /api/screens
POST /api/screens
```

---

## Showtimes

```
GET /api/showtimes
POST /api/showtimes
```

---

## Seats

Generate seats

```
POST /api/seats/generate
```

Get seats

```
GET /api/seats/:screenId
```

---

## Reservations

Create reservation

```
POST /api/reservations
```

Available seats

```
GET /api/reservations/available/:showtimeId
```

User reservations

```
GET /api/reservations/my-reservations
```

Reservation details

```
GET /api/reservations/:id
```

Cancel reservation

```
DELETE /api/reservations/:id/cancel
```

---

## Seat Lock

Lock Seats

```
POST /api/seat-lock/lock
```

Unlock Seats

```
POST /api/seat-lock/unlock
```

---

## Payments

Create Order

```
POST /api/payments/create-order
```

Verify Payment

```
POST /api/payments/verify
```

Get Payments

```
GET /api/payments/my-payments
```

---

# Socket Events

Client Emits

```
join-showtime
```

Server Emits

```
seat-locked
seat-booked
seat-unlocked
payment-confirmed
```

---

# Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Role Based Access
- Redis Seat Locking
- Payment Signature Verification

---

# Future Improvements

- Admin Dashboard
- Analytics
- Charts
- Coupon System
- Reviews & Ratings
- Wishlist
- Recommendation Engine
- Docker Deployment
- CI/CD
- AWS Deployment
- Microservices Architecture

---

# Author

Abhinav Bollagani

CSE, IIIT Lucknow

https://roadmap.sh/projects/movie-reservation-system

---

# License

MIT License
