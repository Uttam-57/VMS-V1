<div align="center">

# 🏢 VMS — Visitor Management System

**A complete digital solution for managing visitors at any organization.**
*From gate entry to exit — fully tracked, fully secure, fully real-time.*

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20App-7c3aed?style=for-the-badge)](https://vms-v1-x6hh.onrender.com)
[![Performance](https://img.shields.io/badge/Lighthouse%20Performance-99%2F100-00c853?style=for-the-badge&logo=lighthouse)](https://vms-v1-x6hh.onrender.com)
[![SEO](https://img.shields.io/badge/SEO-100%2F100-00c853?style=for-the-badge)](https://vms-v1-x6hh.onrender.com)
[![Best Practices](https://img.shields.io/badge/Best%20Practices-100%2F100-00c853?style=for-the-badge)](https://vms-v1-x6hh.onrender.com)

</div>

---

## 🤔 Wait — What Does This Project Actually Do?

Think of any office, hospital, factory, or school. Every single day, dozens or even hundreds of visitors walk in — clients, delivery people, job applicants, vendors, family members. Someone at the front desk manually writes their name in a register, maybe takes a photocopy of their ID, and hands them a paper slip. **That is the old way.**

**VMS replaces that entire process with software.**

A visitor walks up to a kiosk (tablet/computer at the reception), fills in their details digitally, gets their photo taken, and in seconds — a digital gate pass is generated. The security staff gets a real-time notification on their screen. They can approve or reject the entry. When the visitor leaves, they are checked out. Everything is logged, searchable, and reportable.

**No paper. No guesswork. No security gaps.**

---

## 🌟 Why This Is Not Just "Another Basic Project"

Most beginners build a form that saves data to a database. That is it. This project goes many steps further:

### ✅ Real-Time Live Dashboard (No Refresh Needed)
The dashboard shows live visitor data **without you ever pressing refresh**. The moment a new visitor form is submitted from the kiosk, every admin dashboard connected to the system instantly updates. This is built using **Server-Sent Events (SSE)** — the same technology used by live score apps and stock tickers.

> 🔁 **In simple words:** It is like getting a WhatsApp message notification the moment a visitor arrives — without you having to keep checking your phone.

### ✅ Smart Auto-Expiry System
Every gate pass has an "allowed hours" duration. The system automatically calculates whether a visitor has overstayed — even without any scheduled job or cron script. The status changes to **"Expired"** the moment the allowed time is up, calculated on-the-fly every time the data is read.

> ⏱️ **In simple words:** If a visitor was allowed 2 hours and they are still inside after 2 hours, their pass auto-expires — no one has to manually mark it.

### ✅ Photo + Aadhaar Document Upload
When filling a gate pass, visitors can have their **photo taken via webcam** right at the kiosk. Each accompanying person can also upload their Aadhaar card for identity verification. Photos are securely stored on **Cloudinary** (a professional cloud image service), not on the server itself.

### ✅ Granular Role-Based Permissions
Not everyone in the office should see everything. This system has a full **role and permission engine**:
- **Super Admin** — full access to everything
- **Security Guard** — can only check-in / check-out
- **Manager** — can approve/reject passes and view reports
- **Custom Roles** — you can create any role with any combination of permissions

Each role also has **data visibility control** — some users see only their location's data, others see everything across all locations.

### ✅ Visitor Auto-Fill (Returning Visitors)
When a returning visitor enters their mobile number, the system **automatically fills in their details** from past records. No need to type their name, company, email again. Reduces errors and saves time.

### ✅ Google Lighthouse Score: 99/100 Performance
This app was built with performance as a priority:
- **99/100 Performance** — loads extremely fast
- **100/100 SEO** — optimized for search engines
- **100/100 Best Practices** — follows all modern web standards
- **93/100 Accessibility** — usable by people with disabilities

---

## 🏗️ How It Is Built (For Developers)

This project is split into two parts: a **Frontend** (what users see) and a **Backend** (the engine running behind the scenes).

```
VMS-V1-CP-main/
├── pass-Frontend/     → React app (what you see in the browser)
└── backend/           → Node.js API (the server, database, logic)
```

### Frontend Stack

| Tool | Purpose |
|------|---------|
| **React 19** | UI framework — building the interface |
| **Vite 8** | Super-fast build tool |
| **TailwindCSS v4** | Styling the UI |
| **React Router v7** | Navigation between pages |
| **Axios** | Making API requests to the backend |
| **Zod** | Validating form data before sending |
| **Lucide React** | Icons throughout the UI |

### Backend Stack

| Tool | Purpose |
|------|---------|
| **Node.js + Express 5** | The server that handles all requests |
| **Prisma ORM** | Type-safe database querying |
| **TiDB Cloud (MySQL)** | Cloud-hosted database with SSL |
| **Cloudinary** | Cloud image storage for visitor photos |
| **JWT + bcrypt** | Secure login with hashed passwords |
| **Winston + Morgan** | Professional-grade logging |
| **Helmet** | Security HTTP headers |
| **express-rate-limit** | Prevents API abuse / DDoS |
| **Multer** | Handles photo/file uploads |
| **Zod** | Server-side request validation |

### Database Models
The database has **12 tables** covering:
- `formdata` — the core gate pass record
- `persondetail` — accompanying persons with Aadhaar
- `user` — admin staff accounts
- `role` — permission configurations
- `employee` — employee directory (for "meeting with")
- `location` — multi-site support
- `department` — department management
- `carrywith`, `purpose`, `visitingarea`, `visitortype`, `idtype` — master configuration tables

---

## 🔐 Security Features Built-In

| Feature | What it does |
|---------|-------------|
| **JWT Access + Refresh Tokens** | Secure login that auto-refreshes without logging out |
| **HTTP-only Cookies** | Refresh tokens stored safely — not accessible by JavaScript |
| **bcrypt Password Hashing** | Passwords are never stored as plain text (12 salt rounds) |
| **Helmet.js** | Adds security headers to every response |
| **Rate Limiting** | Max 1000 API requests per 15 minutes per IP |
| **Input Sanitization** | Prevents XSS and injection attacks |
| **Permission Middleware** | Every API route checks role permissions |
| **SSL Database Connection** | Database connects over encrypted SSL (ISRG Root X1 cert) |

---

## 📡 Real-Time Architecture

```
[Visitor Kiosk]  ──POST /upload──▶  [Backend API]
                                         │
                                    SSE broadcast
                                         │
                                         ▼
                              [All Admin Dashboards]
                              (update instantly, live)
```

When a visitor submits their form:
1. The backend saves the data and uploads the photo to Cloudinary
2. It immediately broadcasts a **Server-Sent Event** to all connected admin browsers
3. Every dashboard updates **live** — no polling, no refresh needed

---

## 🧩 Key Pages and Features

| Module | What it does |
|--------|-------------|
| **Dashboard** | Live visitor control center — check-in/out, pending passes, stats |
| **Create Pass** | Multi-step form with webcam capture, multi-person support |
| **User Management** | Create/edit/deactivate staff accounts |
| **Master Settings** | Configure departments, purposes, visitor types, locations, etc. |
| **Reports** | Filter and export visitor pass history |
| **Print Settings** | Customize the printed gate pass format |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+
- npm v9+
- A MySQL/TiDB database

### Backend Setup
```bash
cd backend
npm install

# Create your .env file (copy from .env.example)
cp .env.example .env
# Fill in your DATABASE_URL, JWT_SECRET, CLOUDINARY keys

# Push database schema
npm run db:push

# Seed master data (optional)
npm run seed:master
npm run seed:company

# Start dev server
npm run dev
# Runs on http://localhost:3000
```

### Frontend Setup
```bash
cd pass-Frontend
npm install

# Create your .env file
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:3000/api/v1

# Start dev server
npm run dev
# Runs on http://localhost:5173
```

---

## 🌐 Deployment

Both frontend and backend are deployed on **Render**:

| Service | URL |
|---------|-----|
| Frontend | https://vms-v1-x6hh.onrender.com |

> ⚠️ **Note on Render Free Tier:** The backend may take ~30 seconds to wake up after inactivity. This is a limitation of Render's free plan.

### Environment Variables

**Backend `.env`**
```env
DATABASE_URL=mysql://...
NODE_ENV=production
PORT=3000
CLIENT_URL=https://your-frontend.onrender.com
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**Frontend `.env`**
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
```

---

## 📁 Project Structure

```
backend/src/
├── app.js                     # Express app setup, CORS, middleware
├── server.js                  # HTTP server entry point
├── config/
│   └── db.js                  # Prisma client singleton
├── middleware/
│   ├── auth.middleware.js      # JWT verification
│   ├── permission.middleware.js # Role-based access control
│   ├── ratelimit.middleware.js  # API rate limiting
│   ├── sanitize.middleware.js   # XSS / input sanitization
│   └── errorHandler.js         # Global error handler
├── features/
│   ├── auth/                  # Login, register, refresh token
│   ├── gate_pass/             # Core: create pass, check-in/out, SSE
│   ├── user/                  # User management
│   ├── role/                  # Role and permissions management
│   ├── master/                # Master data aggregation
│   ├── report/                # Reporting
│   ├── department/            # Department CRUD
│   ├── employee/              # Employee directory
│   ├── location/              # Multi-site locations
│   ├── purpose/               # Visit purposes
│   ├── visitor_type/          # Visitor categories
│   ├── visiting_area/         # Visiting areas / floors
│   ├── carry_with/            # Items visitors may carry
│   └── id_type/               # ID document types
└── utils/
    ├── logger.utils.js        # Winston structured logging
    ├── jwt.utils.js           # JWT sign/verify helpers
    ├── cloudinary.js          # Image upload/delete helpers
    └── appError.js            # Custom error class

pass-Frontend/src/
├── features/
│   ├── createpass/            # Multi-step gate pass creation
│   ├── dashboard/             # Live control center
│   ├── mastersetting/         # Admin configuration panels
│   ├── report/                # Visitor report views
│   └── print/                 # Print template settings
├── shared/
│   ├── services/
│   │   ├── ApiClient.js       # Axios instance with interceptors, metrics
│   │   └── api.js             # Configured API client singleton
│   └── utils/
│       └── logger.js          # Frontend structured logger
└── pages/                     # Route-level page components
```

---

## 💡 What Makes This Production-Ready

1. **Structured Logging** — Every request, error, and database query is logged using Winston with timestamps and log levels
2. **Custom API Client** — The frontend has a fully custom Axios wrapper with request metrics, slow request tracking, and automatic token refresh
3. **Global Error Handler** — The backend has a unified error handler that formats all errors consistently
4. **Input Validation at Both Layers** — Zod schemas validate data on both frontend and backend independently
5. **Database Connection Pooling** — Prisma manages connections efficiently for production load
6. **Image Cleanup** — When a pass is deleted, its Cloudinary photo is also deleted (no orphaned files)

---

## 👤 Author

Built by **Uttam** — a developer who believes in building things the right way, not just the fast way.

> *"Anyone can build a form. I built a system."*

---

<div align="center">

**⭐ If you found this project impressive, give it a star!**

[![GitHub](https://img.shields.io/badge/GitHub-View%20Source-181717?style=for-the-badge&logo=github)](https://github.com/Uttam-57/VMS-V1)

</div>
