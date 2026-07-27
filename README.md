# YS Investment Consultants

A professional full-stack financial advisory web application.

## Tech Stack

- **Frontend**: React.js (Vite) + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **Email**: Nodemailer (Gmail SMTP)
- **Charts**: Chart.js + react-chartjs-2

## Features

- 🏠 **Premium Landing Page** — Hero, About, Services, Why Choose Us, Contact
- 🔐 **JWT Authentication** — Manager (hardcoded) + Client (register/login)
- 📊 **Manager Dashboard** — Insurance, Mutual Funds, SIP CRUD management
- 👥 **Customer Management** — View clients, search, filter
- 📅 **Appointment System** — Book, manage, approve/reject
- ✉️ **Email Notifications** — Manager & client emails via Nodemailer
- 🧮 **SIP & Lumpsum Calculators** — Interactive charts
- 📱 **Fully Responsive** — Desktop, Tablet, Mobile

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone & Setup

```bash
cd YS_WEB
```

### 2. Setup Server

```bash
cd server
cp ../.env.example .env
# Edit .env with your MongoDB URI and email credentials
npm install
npm run dev
```

### 3. Setup Client

```bash
cd client
npm install
npm run dev
```

### 4. Open in Browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Login Credentials

### Manager
- **Email**: Manager@YS.com
- **Password**: YS@1997

### Client
- Register at /register with your details

## Email Setup (Gmail)

1. Go to Google Account → Security → 2-Step Verification → Enable
2. Go to App Passwords → Generate new app password for "Mail"
3. Copy the 16-char password to `.env` → `EMAIL_PASS`

## Project Structure

```
YS_WEB/
├── client/              # React + Vite Frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth context
│   │   ├── services/    # API service layer
│   │   └── utils/       # Route protection
│   └── ...
├── server/              # Express Backend
│   ├── config/          # Database config
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, upload, error handler
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Email templates
│   └── uploads/         # Product images
└── .env.example
```

## Contact

- **Instagram**: [@ysinvestmentconsultant](https://www.instagram.com/ysinvestmentconsultants/)
- **Phone**: 9810062733
- **Email**: ysconsultant2020@gmail.com
