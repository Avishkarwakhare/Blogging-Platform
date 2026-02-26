# MarkBlog Platform

A high-performance, full-stack Markdown-powered blogging platform built with the MERN stack. Features a sleek split-pane editor, PDF-to-Markdown extraction, and comprehensive creator analytics.

## 🚀 Features

- **Full-Stack MERN:** MongoDB, Express, React (Vite 7), and Node.js.
- **Markdown Editor:** Real-time split-pane preview with GitHub Flavored Markdown (GFM) support.
- **PDF Extraction:** Instantly convert PDF documents into editable Markdown blog posts.
- **Deep Analytics:** Recharts-powered dashboard tracking views (30-day history), top posts, and category distribution.
- **Activity Log:** Automated tracking of all user actions (creation, updates, deletions, and views).
- **JWT Authentication:** Secure user registration, login, and protected content management.
- **Responsive Design:** Premium UI built with Tailwind CSS 4, featuring full Dark/Light mode support.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Recharts, Lucide React, React Markdown, React Hook Form, Axios.
- **Backend:** Node.js, Express, Mongoose (MongoDB), JWT, Bcryptjs, Multer, PDF-Parse.
- **Database:** MongoDB.

## 📦 Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Backend Configuration
Create a `.env` file in the `/backend` folder:
```env
PORT=4000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
NODE_ENV=development
```

### 3. Frontend Configuration
Create a `.env` file in the `/frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### 4. Installation & Running
From the root directory:
```bash
# Install all dependencies (Root, Frontend, and Backend)
npm run install-all

# Start both frontend and backend concurrently
npm run dev
```

## 📖 API Documentation

### Auth
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Authenticate user

### Blogs
- `GET /api/blogs` - List published blogs (Public) / Filtered blogs (Private)
- `GET /api/blogs/:id` - Get blog by ID & track view
- `POST /api/blogs` - Create blog (Protected)
- `PUT /api/blogs/:id` - Update blog (Protected)
- `DELETE /api/blogs/:id` - Delete blog (Protected)
- `POST /api/blogs/upload` - Upload cover image (Protected)

### PDF & Analytics
- `POST /api/pdf/upload` - Extract text from PDF (Protected)
- `GET /api/analytics/overview` - Get high-level stats (Protected)
- `GET /api/analytics/views-over-time` - 30-day view data (Protected)
- `GET /api/analytics/top-posts` - Most viewed posts (Protected)
- `GET /api/analytics/category-distribution` - Category breakdown (Protected)
- `GET /api/analytics/activity` - Recent user activity log (Protected)

## 📄 License
MIT
