# WorkspaceOS

WorkspaceOS is a modern workforce management platform for fast-moving employers. It features employer/employee portals, secure onboarding, worker tracking, and organization isolation via admin codes.

## Features & Tech Stack

- **Employer**: Registration, worker management, performance tracking, dashboard stats.

- **Employee**: Login portal, profile access, ratings, and role info.

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, SWR.

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs.

## Getting Started

**Prerequisites**: Node.js 22+, npm, MongoDB.

1. **Clone & Install**:

   ```bash
   git clone <repo-url> && cd workspaceos
   cd frontend && npm install && cd ../backend && npm install
   ```

1. **Environment**: Create `.env` in `backend/` with `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `EMAIL_USER`, `EMAIL_PASS`.

1. **Run**:

- Backend: `cd backend && npm run dev` (Port 5000)
- Frontend: `cd frontend && npm run dev` (Port 8080)

## API & Authentication

- **Base URL**: `/api/v1`

- **Auth**: JWT via secure cookies.

- **Endpoints**: `/register`, `/login`, `/employee/login`, `/employees` (GET/POST/PATCH/DELETE).

## Security & Deployment

- **Security**: Password hashing, protected routes, organization isolation, HTTP-only cookies, CORS.

- **Testing**: Vitest + Testing Library (`npm run test`).

- **Deployment**: Frontend (Vercel), Backend (Render, Railway, Fly.io).

## Roadmap & License

- **Future**: Role-based permissions, analytics, payroll, attendance, messaging, notifications.

- **License**: [ISC License](./LICENSE)

- **Author**: Opeyemi Oyeboade.
