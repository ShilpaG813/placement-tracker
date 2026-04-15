# 🎯 Smart Placement Tracker

A full-stack web application built for engineering students to manage their entire placement journey — track applications and analyze performance through an analytics dashboard.

## 🌐 Live Demo
🔗 [Live Demo](https://placement-tracker-pi-tawny.vercel.app)

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with token-based auth
- 📋 **Application Tracker** — Add, update, filter and manage all job applications with round-wise tracking
- 📊 **Analytics Dashboard** — Visual charts showing success rate, rejection rate, company-wise stats and smart insights
- 👤 **Profile Management** — Edit profile, skills, CGPA and resume link
- 🔍 **Search & Filter** — Filter applications by status and search by company/role

## 🧪 How to Use
1. Open the Live Demo link
2. Sign up using your email
3. Add your interview details
4. View upcoming and past interviews
5. Edit or delete reminders anytime

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, Bcrypt |
| Deployment | Vercel (Frontend), Render (Backend) |

## 📸 Screenshots

> Dashboard with analytics
> Applications tracker

*(Add screenshots after deployment)*

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Gmail account with App Password enabled

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ShilpaG813/placement-tracker.git
cd placement-tracker
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Create `.env` file in backend folder**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

4. **Setup Frontend**
```bash
cd frontend
npm install
```

5. **Run the app**

Backend:
```bash
cd backend
node server.js
```

Frontend:
```bash
cd frontend
npm start
```

App runs on `http://localhost:3000`

## 📁 Project Structure
```
placement-tracker/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Email & cron job services
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── context/     # Auth & Toast context
```

## 🔮 Upcoming Features
- 🤖 AI Mock Interview Assistant
- 📈 CGPA Eligibility Checker
- 🏆 Interview Experience Feed
- 🔔 Smart Email Reminders — Email notification system

## 👩‍💻 Author
**Shilpa G**
[LinkedIn](https://linkedin.com/in/shilpa-g813) | [GitHub](https://github.com/ShilpaG813)
