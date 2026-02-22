# 🚀 SecureSend
### A Production-Grade Fintech Wallet System

<p align="center">
  <b>ACID Compliant • Ledger-Based Architecture • Idempotent Transfers • Admin Controls • Audit Logging</b>
</p>

---

## 📌 Overview

**SecureSend** is a full-stack fintech wallet system inspired by real-world payment systems like Stripe and Razorpay.

This project demonstrates:

- Financial-grade transaction safety
- Double-spend prevention
- Ledger-based accounting model
- Role-based access control
- Audit logging system
- Admin freeze/unfreeze controls
- Rate-limited authentication

Built with production architecture in mind — not just CRUD.

---

## 🏗️ Architecture Highlights

### 🔐 ACID-Compliant Transfers
- MySQL transactions (`BEGIN`, `COMMIT`, `ROLLBACK`)
- Row-level locking using `SELECT ... FOR UPDATE`
- Deterministic locking order to prevent deadlocks
- Deadlock retry logic

---

### 💳 Ledger-Based Accounting (Single Source of Truth)

Every transfer creates **two ledger entries**:

- `DEBIT` entry (negative amount)
- `CREDIT` entry (positive amount)

Wallet balance is derived from ledger integrity.

---

### 🔁 Idempotent API

Each transfer requires a **client-generated idempotency key**.

Prevents:
- Duplicate payments
- Retry double-spend
- Network retry inconsistencies

---

### 🛡️ Security Features

- JWT (HTTP-only cookies)
- Role-based authorization (USER / ADMIN)
- Login rate limiting (10 attempts per 10 minutes)
- Wallet freeze protection
- Password hashing using bcrypt
- CORS protection
- Input validation

---

### 🧾 Audit Logging System

Every critical action logs:

- LOGIN_SUCCESS
- LOGIN_FAILED
- TRANSFER_SUCCESS
- TRANSFER_FAILED
- FREEZE / UNFREEZE

Stored in dedicated `audit_logs` table.

Audit logs **never block main transaction logic**.

---

## 🖥️ Tech Stack

### Backend
- Node.js
- Express
- MySQL
- Redis (optional optimization)
- JWT
- bcrypt

### Frontend
- React
- Tailwind CSS
- Axios
- React Router

---

## 📂 Project Structure

```
SecureSend/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── configs/
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── context/
│   └── services/
│
└── README.md
```

---

## ⚙️ Core Features

### 👤 User
- Register / Login
- Secure cookie authentication
- View balance
- Transfer money
- Transaction history (paginated)
- Change password

### 👨‍💼 Admin
- View all users
- Freeze wallet with reason
- Unfreeze wallet
- View audit logs

---

## 🔄 Transfer Flow (High-Level)

1. Insert `PENDING` transaction
2. Lock wallets deterministically
3. Validate balance & freeze status
4. Insert two ledger entries
5. Update wallet balance
6. Mark transaction `SUCCESS`
7. Commit transaction
8. Log audit event

---

## 🧠 Why This Project Is Different

Most wallet demos:
- Directly update balance
- No locking
- No idempotency
- No ledger
- No audit logs

SecureSend implements **real payment-system concepts** used in fintech systems.

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```
git clone https://github.com/YOUR_USERNAME/SecureSend.git
cd SecureSend
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=securesend
JWT_SECRET=your_secret_key
```

Run:

```
npm start
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 📊 Future Improvements

- Redis balance caching
- Razorpay integration
- Transfer reversal system
- Cursor-based pagination
- Dockerization
- CI/CD pipeline
- Unit & integration tests

---

## 📌 Author

Built by Ibrahim  
Backend-focused developer passionate about fintech systems.

---

## ⭐ If You Like This Project

Give it a star ⭐  
Feedback and suggestions are welcome.

