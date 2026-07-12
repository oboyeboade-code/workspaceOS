# WorkspaceOS

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A lightweight workforce management platform for fast-moving employers. Handles onboarding, employee tracking, and organization-level isolation with employer/employee portals.

## Features

**Employer Portal**

- Registration + auth with admin-code org isolation
- Add/manage workers, generate credentials
- Search, filtering, performance tracking, dashboard stats

**Employee Portal**

- Login portal, view employer info + personal profile
- Access role info, ratings, protected routes

**Platform**

- JWT auth, cookie sessions, bcrypt password hashing
- MongoDB + REST API, responsive UI with TailwindCSS + shadcn/ui
- SWR data fetching, React Hook Form + Zod validation

## Tech Stack

| Area             | Technologies                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| **Frontend**     | React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, React Router, SWR, React Hook Form, Zod, Radix UI |
| **Backend**      | Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs, Nodemailer                            |
| **Testing**      | Vitest, Testing Library, JSDOM                                                                        |
| **Architecture** | `Routes → Controllers → Services → Models`                                                            |

## Project Structure

```text
workspaceos/
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       └── test/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── server.ts
└── README.md
```
