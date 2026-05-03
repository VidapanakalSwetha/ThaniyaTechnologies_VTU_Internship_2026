# 🏥 MediBook - Healthcare Appointment Booking System

A full-stack MERN web application for booking healthcare appointments online.

Built as part of the **Thaniya Technologies VTU Internship 2026**.

---


## ✨ Features

### 👤 Patient
- Register and login securely
- Browse doctors by specialization
- Filter doctors using quick filter buttons
- Book appointments with available time slots
- View and cancel appointments

### 👨‍⚕️ Doctor
- Register and create profile
- View all patient appointments
- Confirm, cancel or complete appointments
- View personal profile and availability

### 🔧 Admin
- Dashboard with system statistics
- Approve or reject doctor registrations
- View and manage all users
- Monitor all appointments

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Password Security | bcryptjs |
| Notifications | React Toastify |

---

## 📁 Project Structure
Healthcare-Appointment-Booking/
├── client/                 # React Frontend
│   └── src/
│       ├── components/     # Navbar
│       ├── context/        # Auth Context
│       ├── pages/          # Login, Register, Dashboards
│       └── utils/          # Axios config
├── server/                 # Node.js Backend
│   ├── config/             # MongoDB connection
│   ├── controllers/        # Business logic
│   ├── middleware/         # JWT auth middleware
│   ├── models/             # Mongoose schemas
│   └── routes/             # API routes
└── README.md

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- npm

### Backend Setup
```bash
cd server
npm install
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

### Environment Variables
Create a `.env` file inside `server/` folder:

PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key

---

## 👩‍💻 Developed By
**Vidapanakal Swetha**
VTU Internship 2026 — Thaniya Technologies