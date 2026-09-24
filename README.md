# SwapSpace – Peer-to-Peer Skill & Item Exchange Platform 🔄

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)

> **SwapSpace** is a modern, full-stack peer-to-peer exchange web application designed for college students to trade **skills** (e.g., *Java ↔ Python*, *Web Dev ↔ Communication*) and **useful physical items** (e.g., *Engineering Textbooks ↔ Scientific Calculators*, *Arduino Kits ↔ Lab Coats*) without monetary transactions.

---

## 📖 Table of Contents

1. [Problem Statement & Objectives](#-problem-statement--objectives)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Architecture & Project Structure](#-architecture--project-structure)
5. [Smart Matching Algorithm](#-smart-matching-algorithm)
6. [Database Schema & Models](#-database-schema--models)
7. [REST API Documentation](#-rest-api-documentation)
8. [Getting Started & Installation](#-getting-started--installation)
9. [Demo Login Credentials](#-demo-login-credentials)
10. [Business Rules & Moderation](#-business-rules--moderation)
11. [Future Enhancements](#-future-enhancements)

---

## 🎯 Problem Statement & Objectives

### The Problem
College students frequently face two common challenges:
1. **Skill Acquisition Costs:** Learning specialized skills (programming languages, design software, presentation techniques) often costs money or lacks personalized peer coaching.
2. **Resource Underutilization:** Semester-specific textbooks, scientific calculators, lab gear, and electronics sit idle once a course ends, while junior students need to buy them brand new.

### The SwapSpace Solution
SwapSpace provides a campus-centric, cash-free bartering ecosystem where:
- Students list the skills and items they possess (*"Offered"*).
- Students declare what they need (*"Wanted"*).
- An automated **Smart Matching Engine** calculates compatibility percentages (up to 98%) and suggests mutual 2-way swaps or 1-way opportunities.
- Built-in proposal workflows, chat messaging, review ratings, and moderation safeguards ensure safe peer exchanges.

---

## ✨ Key Features

- 🔐 **JWT Authentication & Protected Routes:** Secure registration, password hashing with `bcryptjs`, role-based access control (User vs. Admin), and session restoration.
- 👤 **Comprehensive Student Profiles:** College, location, bio, custom avatar, tags for skills/items offered and wanted, aggregate 5-star ratings, and exchange history.
- 🎓 **Skill Exchange Directory:** Listings with category, proficiency levels (*Beginner*, *Intermediate*, *Advanced*), availability slots, and exchange requirements.
- 📦 **Physical Item Exchange Directory:** Listings with category, condition tags (*New*, *Like New*, *Good*, *Used*), image preview, handover availability, and wanted trade items.
- 🔍 **Universal Search & Filter Hub:** Filter by keywords, category, level, condition, location, and listing type with clean responsive card layouts.
- 🔥 **Smart Matching System:** Compares User A's wants against User B's offers and vice versa to compute a percentage score (🔥 *Perfect Swap Match* vs. *One-Way Match*).
- 🤝 **End-to-End Proposal Workflow:** Send exchange proposals with custom offers and messages; receivers can **Accept** or **Decline**; participants can track status (*Pending* → *Accepted* → *Completed* / *Cancelled*).
- 💬 **Peer-to-Peer Chat:** Integrated database-polled messaging unlocked automatically once an exchange is accepted to coordinate meetup details.
- ⭐ **Ratings & Reviews:** 1–5 star ratings and feedback reviews allowed exclusively after an exchange is marked completed, with duplicate review prevention.
- 🛡️ **Admin & Moderation Panel:** Platform statistics, user account suspension/re-enable, listing removal, and dispute/report resolution.
- 🚨 **Reporting System:** Users can report suspicious users, fake items, or inappropriate skills for admin review.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router v7, Axios, Lucide React icons |
| **Backend** | Node.js (v20+ / v24+), Express.js, TypeScript, Mongoose |
| **Database** | MongoDB (Local or MongoDB Atlas) |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs password hashing |
| **Architecture** | RESTful API, MVC Controller pattern, Middleware pipelines |

---

## 📂 Architecture & Project Structure

```text
swapspace/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection helper (db.ts)
│   │   ├── controllers/     # Express business logic (auth, user, skill, item, exchange, match, message, review, report, admin)
│   │   ├── middleware/      # auth.ts (JWT & RBAC), validate.ts, errorHandler.ts
│   │   ├── models/          # Mongoose models (User, Skill, Item, ExchangeRequest, Message, Review, Report)
│   │   ├── routes/          # Express route definitions
│   │   ├── utils/           # JWT generator, Smart Match scoring algorithm
│   │   ├── seed.ts          # Complete database seed script with realistic demo data
│   │   └── server.ts        # Express app initialization, CORS, route mounting
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/       # SkillCard, ItemCard, MatchCard, ExchangeCard, ReviewCard, UserCard
│   │   │   └── common/      # Avatar, Badge, StarRating, Modal, ConfirmDialog, ExchangeModal, ReviewModal, ReportModal, LoadingSpinner, EmptyState
│   │   ├── context/         # AuthContext (state & tokens), ToastContext (notifications)
│   │   ├── layouts/         # AppLayout, Navbar, Footer, Sidebar, ProtectedRoute, AdminRoute
│   │   ├── pages/           # Home, Login, Register, Discover, SkillDetail, ItemDetail, CreateSkill, CreateItem, EditSkill, EditItem, Dashboard, Matches, Exchanges, ExchangeDetail, Messages, Profile, MyProfile, Admin/*, NotFound
│   │   ├── services/        # Axios API services (api, auth, skill, item, exchange, match, message, review, report, user, admin)
│   │   ├── types/           # TypeScript data interfaces
│   │   ├── App.tsx          # Main React Router setup
│   │   ├── index.css        # Tailwind CSS directives & typography
│   │   └── main.tsx         # React DOM root mounting
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🧠 Smart Matching Algorithm

The matching algorithm compares the tokenized requirements between two users or two listings:

$$\text{Match Score} = f(\text{User A Wants} \leftrightarrow \text{User B Offers}, \, \text{User B Wants} \leftrightarrow \text{User A Offers})$$

1. **🔥 Perfect Match (85% – 98%):**
   - User A offers what User B wants **AND** User B offers what User A wants.
2. **⚡ One-Way Match (50% – 75%):**
   - User B offers what User A wants (or vice versa).
3. **🏫 Campus Peer Bonus (35%):**
   - Same college/university bonus score.

---

## 🗄️ Database Schema & Models

| Model | Key Fields | Purpose |
|---|---|---|
| **User** | `name`, `email`, `password`, `college`, `location`, `bio`, `avatar`, `skillsOffered`, `skillsWanted`, `itemsOffered`, `itemsWanted`, `role`, `isDisabled`, `avgRating`, `totalReviews` | User account and trade preferences |
| **Skill** | `owner`, `name`, `category`, `description`, `level`, `availability`, `wantInExchange`, `isActive` | Skill listings |
| **Item** | `owner`, `name`, `category`, `description`, `condition`, `imageUrl`, `availability`, `wantInExchange`, `isActive` | Physical item listings |
| **ExchangeRequest** | `sender`, `receiver`, `exchangeType`, `offeredSkill`, `offeredItem`, `requestedSkill`, `requestedItem`, `customOfferText`, `message`, `status`, `completedBySender`, `completedByReceiver` | Swap proposals and lifecycle |
| **Message** | `sender`, `receiver`, `exchange`, `content`, `isRead` | Peer chat messages |
| **Review** | `reviewer`, `reviewee`, `exchange`, `rating` (1–5), `comment` | Rating and feedback |
| **Report** | `reporter`, `targetType`, `targetId`, `targetTitle`, `reason`, `description`, `status`, `adminNotes` | Moderation flags |

---

## 🔌 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new student account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET  /api/auth/me` — Fetch currently authenticated user session

### Users (`/api/users`)
- `GET  /api/users` — Search and filter students directory
- `GET  /api/users/dashboard/stats` — User dashboard statistics and recent active exchanges
- `GET  /api/users/:id` — Public user profile with listings & reviews
- `PUT  /api/users/:id` — Update current user's profile and exchange preferences

### Skills (`/api/skills`)
- `GET    /api/skills` — Search skills with category, level, location filters
- `GET    /api/skills/my/listings` — Fetch skills created by current user
- `GET    /api/skills/:id` — Single skill details
- `POST   /api/skills` — Create a new skill listing
- `PUT    /api/skills/:id` — Edit owned skill listing
- `DELETE /api/skills/:id` — Delete owned skill listing

### Items (`/api/items`)
- `GET    /api/items` — Search items with category, condition, location filters
- `GET    /api/items/my/listings` — Fetch items created by current user
- `GET    /api/items/:id` — Single item details
- `POST   /api/items` — Create a new item listing
- `PUT    /api/items/:id` — Edit owned item listing
- `DELETE /api/items/:id` — Delete owned item listing

### Smart Matching (`/api/matches`)
- `GET /api/matches` — Get smart matches for current logged-in user
- `GET /api/matches/listing/:type/:id` — Get compatible listings for a specific skill/item

### Exchanges (`/api/exchanges`)
- `POST /api/exchanges` — Send an exchange request
- `GET  /api/exchanges/sent` — Get sent exchange proposals
- `GET  /api/exchanges/received` — Get received exchange proposals
- `GET  /api/exchanges/:id` — View full exchange details
- `PUT  /api/exchanges/:id/accept` — Accept proposal (Receiver only)
- `PUT  /api/exchanges/:id/reject` — Decline proposal (Receiver only)
- `PUT  /api/exchanges/:id/cancel` — Cancel pending proposal
- `PUT  /api/exchanges/:id/complete` — Mark exchange as completed

### Messages (`/api/messages`)
- `POST /api/messages` — Send a message in an accepted exchange
- `GET  /api/messages/:exchangeId` — Fetch chat history for an exchange
- `GET  /api/messages/conversations/list` — List all active peer chat conversations

### Reviews (`/api/reviews`)
- `POST /api/reviews` — Submit 1–5 star rating and comment for completed exchange
- `GET  /api/reviews/user/:userId` — View all public reviews for a user
- `GET  /api/reviews/my/all` — View given & received reviews

### Moderation & Reports (`/api/reports` & `/api/admin`)
- `POST /api/reports` — Submit report on user/skill/item/message
- `GET  /api/reports` — List all reports (Admin only)
- `PUT  /api/reports/:id` — Update report status (Admin only)
- `GET  /api/admin/stats` — Platform metrics and totals (Admin only)
- `PUT  /api/admin/users/:id/toggle-status` — Suspend or re-enable student account (Admin only)
- `DELETE /api/admin/skills/:id` — Remove inappropriate skill (Admin only)
- `DELETE /api/admin/items/:id` — Remove inappropriate item (Admin only)

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: v18 or higher (v20+ recommended)
- **npm**: v9 or higher
- **MongoDB**: Local MongoDB instance running on `localhost:27017` or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.

---

### Step 1: Clone Repository & Configure Environment

```bash
# Clone repository
git clone https://github.com/your-username/swapspace.git
cd swapspace
```

#### Backend Environment:
Create `backend/.env` (or copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/swapspace
JWT_SECRET=swapspace_super_secret_jwt_key_development_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend Environment:
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Step 2: Install Dependencies

```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Install Frontend Dependencies
cd ../frontend
npm install
```

---

### Step 3: Seed Demo Data

Run the seed script in the backend directory to populate 6 realistic user accounts, 8 skills, 8 items, 5 exchange requests, and 5 reviews:

```bash
cd backend
npm run seed
```

---

### Step 4: Run Application

Open two terminal windows:

#### Terminal 1 — Start Backend Server:
```bash
cd backend
npm run dev
```
*Backend API will run at `http://localhost:5000`*

#### Terminal 2 — Start Frontend Server:
```bash
cd frontend
npm run dev
```
*Frontend application will run at `http://localhost:5173`*

---

## 🔑 Demo Login Credentials

All demo accounts share the password: `password123`

| User | Email | Role | Profile Highlights |
|---|---|---|---|
| **Aarav Sharma** | `aarav@swapspace.dev` | Student | Java tutor, wants Python & ML. Offers Java Book & Calculator. |
| **Priya Patel** | `priya@swapspace.dev` | Student | Python & ML instructor, wants Java & React. Offers Arduino Kit. |
| **Rohan Gupta** | `rohan@swapspace.dev` | Student | React & Web Dev coach, wants Java & Video Editing. Offers Keyboard & USB Drive. |
| **Ananya Deshmukh** | `ananya@swapspace.dev` | Student | Graphic Design & Video Editing mentor, wants Public Speaking. Offers Drawing Kit. |
| **Vikram Singh** | `vikram@swapspace.dev` | Student | Public Speaking & Advanced Excel coach. Offers Chemistry Lab Coat. |
| **Platform Admin** | `admin@swapspace.dev` | **Admin** | Access to `/admin` dashboard, user suspension, and report moderation. |

> 💡 **Tip:** On the `/login` page, convenient one-click demo buttons are provided to instantly log into any test account.

---

## 📜 Business Rules Enforced

1. Users cannot send exchange proposals to themselves.
2. Users cannot accept their own proposals.
3. Only the recipient user can accept or reject an exchange request.
4. Only participants in an accepted exchange can view chat messages.
5. Only completed exchanges can receive ratings and reviews.
6. A student cannot review the same completed exchange more than once.
7. Only listing owners or administrators can edit or delete listings.
8. Suspended users are barred from logging in or creating new listings.
9. Passwords are never returned in API payloads and are hashed using bcrypt with salt rounds.

---

## 🔮 Future Enhancements

- 🔔 Real-time push notifications using WebSockets (Socket.IO).
- 📸 Cloud image uploads using Cloudinary / AWS S3.
- 📍 Geo-location distance radius filtering for on-campus swaps.
- 📅 Calendar scheduling integration for tutoring sessions (Google Calendar API).
- 🏆 Campus badges & leaderboards for top student contributors.

---

*Made with ❤️ for peer learning and sustainable college resource sharing.*
