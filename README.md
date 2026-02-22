🚀 SecureSend — ACID-Compliant Fintech Wallet System

SecureSend is a full-stack fintech-style wallet system built to demonstrate strong backend engineering fundamentals including:

ACID-compliant transactions

Deadlock prevention

Idempotent APIs

Double-entry ledger accounting

Role-based access control (RBAC)

Audit logging system

Login rate limiting

This project focuses on data consistency, concurrency handling, and financial integrity, not just CRUD operations.

🏗 Tech Stack
Frontend

React

Tailwind CSS

Axios

Context API

Backend

Node.js

Express

MySQL

JWT (HttpOnly cookie authentication)

Security

Role-based access control

Login rate limiting

Wallet freeze mechanism

Structured audit logs

🔐 Authentication System

JWT stored in HttpOnly cookie

Secure login and logout

Middleware-based token verification

Admin-only routes protected via role check

Rate limiting (10 attempts per IP in 10 minutes)

💰 Money Transfer Engine

Transfers are implemented using financial system principles.

✅ ACID-Compliant Transactions

Each transfer is executed inside a database transaction:

Insert transaction as PENDING

Lock both wallets using SELECT ... FOR UPDATE

Validate:

Sufficient balance

Wallet not frozen

Insert ledger entries (double-entry)

Update wallet balances

Mark transaction as SUCCESS

Commit

If any step fails → rollback.
🔁 Idempotent Transfer API

Each transfer requires an idempotency_key.

Prevents duplicate transfers due to retries

Uses unique constraint (sender_id, idempotency_key)

Safe against network retry duplication

🔒 Deadlock Prevention

Wallet rows are always locked in deterministic order:

const ids = [senderId, receiverId].sort((a, b) => a - b);


Deadlock retry logic handles:

ER_LOCK_DEADLOCK

ER_LOCK_WAIT_TIMEOUT

This prevents circular locking and double spending.

📒 Double-Entry Ledger System

Each transfer creates:

Wallet	Amount
Sender	-X
Receiver	+X

Ledger ensures:

Auditable money movement

Balance reconstruction from history

Financial correctness

Immutable transaction records

🧊 Wallet Freeze System

Admin can:

Freeze a user wallet

Provide freeze reason

Unfreeze wallet

Frozen wallets:

Cannot send money

Cannot receive money

All actions are logged in the audit system.

📝 Audit Logging System

All sensitive operations are logged:

LOGIN_SUCCESS

LOGIN_FAILED

TRANSFER_SUCCESS

TRANSFER_FAILED

FREEZE

UNFREEZE

Audit logs store:

user_id

action

metadata (JSON)

ip_address

timestamp

Audit logging is non-blocking and does not interfere with core transaction logic.

👨‍💼 Admin Panel

Admin can:

View all users

Freeze / Unfreeze accounts

View system-wide audit logs

Admin routes are protected via role-based middleware.

🗃 Database Design

Tables:

users

wallet

transactions

ledger_entries

audit_logs

Indexes added for:

sender_id

receiver_id

idempotency_key

created_at

Designed for concurrency, integrity, and scalability.

🔄 Transfer Flow Summary
Client → Transfer Request
       → Begin Transaction
       → Deterministic Row Lock
       → Validate Balance & Freeze Status
       → Insert Ledger Entries
       → Update Wallet Balances
       → Commit
       → Audit Log (non-blocking)

🧠 Engineering Concepts Demonstrated

ACID database transactions

Row-level locking

Deadlock prevention

Idempotent API design

Double-entry accounting

Concurrency handling

Role-based authorization

Secure cookie authentication

Login rate limiting

Defensive backend programming

🚀 Running Locally
Backend
npm install
npm run dev


Runs on:

http://localhost:5000

Frontend
npm install
npm run dev


Runs on:

http://localhost:5173

🎯 Why This Project Matters

This project demonstrates real-world backend engineering practices used in financial systems:

Preventing double spending

Handling race conditions

Maintaining transactional consistency

Designing audit-compliant systems

Implementing secure authentication flows

It goes beyond CRUD by focusing on correctness and system reliability.

📌 Future Improvements

Ledger-only balance computation (remove wallet.balance)

Redis caching layer

Cursor-based pagination

CSRF protection

Token versioning for forced logout

Background audit processing worker

Metrics & monitoring dashboard

👨‍💻 Author

Built as a backend-focused fintech system to demonstrate production-grade engineering principles.