# Patient Portal & Mini-EMR

A full-stack healthcare application built with **Next.js 16**, **TypeScript**, **Prisma**, and **PostgreSQL**. The application consists of two major sections: an **Admin EMR Dashboard** for providers to manage patients, appointments, and prescriptions, and a **Patient Portal** for patients to securely view their health data.

---

## Features

### Admin EMR Dashboard (`/admin`)
- **Patient Directory** — Searchable table with real-time filtering by name or email
- **Patient CRUD** — Create new patients (with password), edit details, and delete (with cascading cleanup)
- **Appointment CRUD** — Schedule, edit, and delete appointments with support for one-time, weekly, and monthly recurrence
- **Prescription CRUD** — Prescribe, edit, and delete prescriptions using dropdown-based medication and dosage selection (seeded from `data.json`)
- **Delete Confirmation Modals** — All destructive actions require explicit confirmation via a custom-styled modal dialog
- **Summary Cards** — At-a-glance metrics for total patients, appointments, and refill requests

### Patient Portal (`/`)
- **Secure Login** — Cookie-based JWT authentication using `bcrypt` for password hashing and `jose` for token encryption
- **Health Summary Dashboard** — Shows upcoming appointments and medication refills within the next 7 days
- **Appointments Drill-Down** — View the full upcoming appointment schedule projected up to 3 months, with recurring instances mathematically expanded
- **Medications Drill-Down** — View all active prescriptions with refill timelines projected up to 3 months ahead
- **Recurring Schedule Engine** — Appointments and refills marked as `weekly` or `monthly` are algorithmically expanded into individual future instances

### Code Architecture
- **Centralized TypeScript Types** — All interfaces defined in `lib/types/index.ts` (no duplication)
- **Service Layer Pattern** — All database operations live in `lib/services/` (`PatientService`, `AppointmentService`, `PrescriptionService`)
- **Zod Schema Validation** — Strict input validation in `lib/validations/index.ts` (prevents negative quantities, enforces required fields)
- **Recurring Date Utilities** — `lib/utils/recurring.ts` powers the 3-month projection engine
- **Session Management** — `lib/utils/session.ts` handles JWT cookie-based auth
- **Server Actions** — Next.js Server Actions for all form submissions (no redundant API route boilerplate)
- **Light & Dark Mode** — Full support across all pages using Tailwind CSS `dark:` variants, respecting the user's OS preference

---

## Project Structure

```
patient-portal-1/
├── app/
│   ├── page.tsx                          # Patient Portal login
│   ├── portal/
│   │   ├── page.tsx                      # Health summary dashboard
│   │   ├── appointments/page.tsx         # Full appointment schedule (3 months)
│   │   └── medications/page.tsx          # Full prescription & refill view (3 months)
│   └── admin/
│       ├── page.tsx                      # Admin patient directory + search
│       └── patient/
│           ├── new/page.tsx              # New patient form
│           └── [id]/
│               ├── page.tsx              # Patient detail (appointments + prescriptions)
│               ├── edit/page.tsx         # Edit patient info
│               ├── appointments/
│               │   ├── new/page.tsx      # Schedule new appointment
│               │   └── [appId]/edit/page.tsx  # Edit appointment
│               └── prescriptions/
│                   ├── new/page.tsx      # New prescription
│                   └── [prescId]/edit/page.tsx # Edit prescription
├── components/ui/
│   ├── DeleteButton.tsx                  # Reusable delete confirmation modal
│   └── PatientSearch.tsx                 # Real-time search input component
├── lib/
│   ├── services/                         # Centralized data access layer
│   │   ├── patient.service.ts
│   │   ├── appointment.service.ts
│   │   └── prescription.service.ts
│   ├── types/index.ts                    # Shared TypeScript interfaces
│   ├── validations/index.ts              # Zod schemas for form validation
│   └── utils/
│       ├── recurring.ts                  # Recurring date expansion algorithm
│       └── session.ts                    # JWT cookie session management
└── prisma/
    ├── schema.prisma                     # Database schema
    └── seed.ts                           # Seed script (users, medications, dosages)
```

---

## Tech Stack

| Layer       | Technology                                           |
|-------------|------------------------------------------------------|
| Framework   | [Next.js 16](https://nextjs.org) (App Router)       |
| Language    | TypeScript                                           |
| Database    | PostgreSQL                                           |
| ORM         | [Prisma](https://www.prisma.io)                      |
| Styling     | [Tailwind CSS v4](https://tailwindcss.com)           |
| Auth        | `bcrypt` (password hashing) + `jose` (JWT)           |
| Validation  | [Zod](https://zod.dev)                               |
| Icons       | [Lucide React](https://lucide.dev)                   |
| Date Utils  | [date-fns](https://date-fns.org)                     |

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **PostgreSQL** database (local or hosted)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

### 3. Set Up the Database

```bash
# Generate the Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma db push

# Seed the database with sample data (users, medications, dosages, appointments, prescriptions)
npx prisma db seed
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the **Patient Portal** login.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the **Admin EMR Dashboard**.

### Sample Login Credentials

| Email                            | Password       |
|----------------------------------|----------------|
| `mark@some-email-provider.net`   | `Password123!` |
| `lisa@some-email-provider.net`   | `Password123!` |

---

## Database Schema

The application uses five relational tables:

- **User** — Patient records (name, email, hashed password)
- **Appointment** — Linked to a User, supports `none`, `weekly`, `monthly` recurrence
- **Prescription** — Linked to a User, a Medication, and a Dosage; enforces positive quantity
- **Medication** — Lookup table seeded from `data.json` (used in dropdown selectors)
- **Dosage** — Lookup table seeded from `data.json` (used in dropdown selectors)

Cascading deletes are configured so that removing a patient automatically cleans up their appointments and prescriptions.

---

## Validation Rules

- **Medication & Dosage** — Must be selected from database-seeded dropdowns (no freeform entry)
- **Prescription Quantity** — Must be ≥ 1 (Zod `.min(1)` + HTML `min="1"`)
- **Appointment Repeat** — Must be one of: `none`, `weekly`, `monthly`
- **Patient Email** — Must be unique and valid format
- **Patient Password** — Required on creation for portal login

---

## Seeding Data

The application includes a comprehensive seed script that populates your database with sample data.

### Data Sources

- **Medications & Dosages** — Seeded from the Zealthy exercise data at: https://gist.github.com/sbraford/73f63d75bb995b6597754c1707e40cc2
- **Sample Patients** — Pre-configured with appointments and prescriptions
- **Default Credentials** — Use these to test the Patient Portal login

### Running the Seed Script

The seed script is configured in `prisma/seed.ts` and runs automatically after installing dependencies. To manually seed the database:

```bash
npx prisma db seed
```

This will:
1. Create lookup tables for medications and dosages
2. Create sample patient users with hashed passwords
3. Populate sample appointments and prescriptions
4. Initialize the database for immediate testing

To reset and re-seed (destructive):

```bash
npx prisma db push --force-reset
npx prisma db seed
```

---

## Deployment to Vercel

Vercel is the recommended platform for deploying Next.js applications. Follow these steps:

### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Connect Your Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel will auto-detect it as a Next.js project

### 3. Set Up Environment Variables

In the Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

For PostgreSQL hosting, consider:
- **Vercel Postgres** (integrated with Vercel)
- **Supabase** (free tier available)
- **Railway** (PostgreSQL hosting)
- **Neon** (serverless PostgreSQL)

### 4. Deploy

Click **Deploy** and Vercel will:
- Install dependencies
- Run the build (`npm run build`)
- Deploy to a live URL

Vercel will automatically seed your database on first deployment if configured.

### 5. Post-Deployment

Your application will be live at a URL like: `https://your-project-name.vercel.app`

- **Patient Portal** — `https://your-project-name.vercel.app`
- **Admin Dashboard** — `https://your-project-name.vercel.app/admin`

### Environment-Specific Builds

For different database configurations per environment (staging, production), add environment variables in the Vercel dashboard for each deployment environment.

---

## Local Build & Production Test

To test the production build locally before deploying:

```bash
npm run build
npm start
```

This will start the Next.js server in production mode at `http://localhost:3000`.
