Task Manager App 🚀

A full-stack Task Management Web Application built for internship project submission.
It allows users to register, login, and manage tasks efficiently with a modern UI and secure backend.

🌐 Live Demo
Frontend (Vercel): https://task-manager-app-delta-jet.vercel.app/
Backend (Render):  https://task-manager-app-c0x7.onrender.com/apicom

🧰 Tech Stack

Frontend
React (Vite),
Axios,
React Router,
CSS / Tailwind (if used).

Backend
Node.js,
Express.js,
JWT Authentication,
bcrypt.js.

Database
TiDB Cloud (MySQL compatible)

Deployment
Frontend: Vercel,
Backend: Render,
Database: TiDB Cloud.

✨ Features
User Registration & Login (JWT Authentication),
Create, Read, Update, Delete (CRUD) Tasks,
Task Status Tracking (Pending / Completed),
Priority Management (Low / Medium / High),
Due Date Management,
Secure Password Hashing,
RESTful API integration,
Fully responsive UI.

📁 Project Structure
task-manager-app/
│
├── frontend/        # React frontend (Vite)
│   ├── src/
│   └── package.json
│
├── backend/         # Node.js backend (Express)
│   ├── server.js
│   ├── routes/
│   ├── db/
│   └── package.json
│
└── README.md

⚙️ Environment Variables
Backend (.env)
PORT=5000
JWT_SECRET=your_secret_key

DB_HOST=your_tidb_host
DB_USER=your_tidb_user
DB_PASSWORD=your_tidb_password
DB_NAME=task_manager

🚀 Installation & Setup (Local)

1. Clone Repository
git clone https://github.com/your-username/task-manager-app.git
cd task-manager-app

2. Backend Setup
cd backend
npm install
node server.js

3. Frontend Setup
cd frontend
npm install
npm run dev

🔗 API Endpoints

Auth Routes
POST /api/auth/register → Register user
POST /api/auth/login → Login user

Task Routes
GET /api/tasks → Get all tasks
POST /api/tasks → Create task
PUT /api/tasks/:id → Update task
DELETE /api/tasks/:id → Delete task

👨‍💻 Author
Dharshini
Internship Project – Full Stack Development

📌 Future Improvements
Email reminder system
Drag & drop task management
Real-time updates (WebSockets)
Advanced analytics dashboard
