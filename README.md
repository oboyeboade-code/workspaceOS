# WorkspaceOS

WorkspaceOS is a modern workforce management platform built for fast-moving employers who need a lightweight system for onboarding, managing, and tracking employees across organizations.

The platform provides employer and employee portals, secure authentication, worker management, performance tracking, and organization-level isolation using admin codes.

---

## Features

### Employer Features

- Employer registration and authentication
- Secure admin-code based organization isolation
- Add and manage workers
- Generate employee credentials
- Worker search and filtering
- Performance and workforce tracking
- Dashboard statistics
- Protected employer routes

### Employee Features

- Employee login portal
- View assigned employer information
- Access personal worker profile
- View ratings and role information
- Protected employee routes

### Platform Features

- JWT authentication
- Cookie-based session handling
- Password hashing with bcrypt
- MongoDB database integration
- REST API architecture
- Responsive modern UI
- TailwindCSS + shadcn/ui components
- SWR-powered frontend data fetching

---

# Tech Stack

## Frontend

- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- React Router
- SWR
- React Hook Form
- Zod
- Radix UI

## Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer

---

# Project Structure

```bash
workspaceos/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── test/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   └── package.json
│
└── README.md
```

---

# Getting Started

## Prerequisites

Make sure you have the following installed:

- Node.js 22+
- npm
- MongoDB Atlas account or local MongoDB instance

---

# Installation

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd workspaceos
```

---

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

# Environment Variables

Create a `.env` file inside the `backend` directory.

## Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:8080
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

You may also need a frontend `.env.local` depending on your API configuration.

Example:

```env
VITE_API_URL=http://localhost:5000
```

---

# Running the Application

## Start Backend

Inside the `backend` folder:

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

## Start Frontend

Inside the `frontend` folder:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:8080
```

---

# Available Scripts

## Frontend Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

## Backend Scripts

```bash
npm run dev
npm run build
npm start
npm run typecheck
```

---

# Authentication Flow

WorkspaceOS uses JWT authentication with secure cookies.

### Employer Flow

1. Employer registers
2. Admin code is generated/stored
3. Employer logs in
4. Employer creates workers
5. Worker credentials are distributed

### Employee Flow

1. Employee receives credentials
2. Employee logs in
3. Employee accesses protected dashboard

---

# API Overview

Base URL:

```bash
/api/v1
```

Typical endpoints include:

```bash
POST   /register
POST   /login
POST   /employee/login
GET    /employees
POST   /employees
PATCH  /employees/:id
DELETE /employees/:id
```

---

# UI Highlights

- Responsive dashboard layouts
- Elegant onboarding experience
- Modern gradients and glassmorphism-inspired design
- Reusable component architecture
- Accessible UI primitives from Radix UI

---

# Testing

Frontend testing is configured with:

- Vitest
- Testing Library
- JSDOM

Run tests:

```bash
npm run test
```

---

# Deployment

## Frontend

The frontend is configured for deployment with Vercel.

## Backend

The backend can be deployed on:

- Render
- Railway
- Fly.io
- VPS providers

Ensure environment variables are configured properly in production.

---

# Future Improvements

- Role-based permissions
- Analytics dashboard
- Payroll integrations
- Attendance tracking
- Team messaging
- File uploads
- Notifications system
- Multi-tenant scaling improvements

---

# Security

WorkspaceOS includes:

- Password hashing
- JWT authentication
- Protected routes
- Organization isolation using admin codes
- HTTP-only cookies
- CORS configuration

---

# License

This project is licensed under the ISC License.

---

# Author

Built by Opeyemi Oyeboade.
