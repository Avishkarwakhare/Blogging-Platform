# MarkBlog Platform

A full-stack Markdown-powered blogging platform built with the MERN stack. Features a live split-pane editor and beautiful analytics.

## 🚀 Features

- **Full-Stack MERN:** MongoDB, Express, React (Vite), and Node.js.
- **Markdown Editor:** Live split-pane preview with GitHub Flavored Markdown (GFM) support.
- **PDF Content Extraction:** Upload PDF files to automatically extract and append text to your blog posts.
- **Deep Analytics:** Recharts-powered dashboard showing views over time, top posts, and category distribution.
- **JWT Authentication:** Secure user registration, login, and protected routes.
- **Responsive Design:** Fully responsive UI with Tailwind CSS and Dark/Light mode support.
- **Activity Log:** Comprehensive tracking of all user actions (publish, view, update, delete).

## 🛠️ Tech Stack

- **Frontend:** React, React Router v6, Tailwind CSS, Recharts, React Hook Form, Axios, Lucide React, React Hot Toast.
- **Backend:** Node.js, Express, Mongoose, JWT, Bcryptjs, Pdf-parse.
- **Database:** MongoDB.

## 📦 Setup Instructions

### 1. Prerequisite
- Node.js installed.
- MongoDB instance (Local via MongoDB Compass/Docker or MongoDB Atlas).

### 2. Backend Configuration
Create a `.env` file in the `/backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

### 3. Frontend Configuration
Create a `.env` file in the `/frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Installation & Running
From the root directory:
```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend concurrently
npm run dev
```

## 📖 API Documentation

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Authenticate user
- `GET /api/blogs` - List all published blogs (Public)
- `GET /api/blogs/:id` - Get blog by ID & track view (Public)
- `POST /api/blogs` - Create blog (Protected)
- `POST /api/pdf/upload` - Upload PDF and extract text (Protected)
- `GET /api/analytics/overview` - Get account stats (Protected)

## 📄 License
MIT
