# 🏫 House Of Edtech - Learning Management System

A comprehensive web-based Learning Management System (LMS) that enables instructors to create and manage courses with video lectures, and allows students to enroll, learn, and track their progress through interactive content.

**Live Demo:** [house-of-edtech-virid.vercel.app](https://house-of-edtech-virid.vercel.app)

---

## 📊 Language Composition

This repository is built primarily with modern web technologies:

| Language | Percentage | Use Case |
|----------|-----------|----------|
| **TypeScript** | 97.7% | Backend API (Node.js/Express) & Frontend (Next.js) type-safe development |
| **CSS** | 2.0% | Styling with Tailwind CSS utilities |
| **JavaScript** | 0.3% | Configuration files and utilities |

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### For Instructors
- ✅ Create and manage courses with detailed descriptions
- ✅ Upload and organize video lectures with lessons
- ✅ Set course pricing and difficulty levels
- ✅ Generate course thumbnails
- ✅ Create AI-powered quizzes for courses
- ✅ View enrolled students
- ✅ Track student progress and performance
- ✅ Publish/unpublish courses
- ✅ Add tags and categories to courses

### For Students
- ✅ Browse and search for courses
- ✅ Enroll in courses (free or paid)
- ✅ Watch video lectures and access course materials
- ✅ Mark lessons as complete and track progress
- ✅ Take quizzes and assessments
- ✅ View enrolled courses and learning progress
- ✅ View course ratings and reviews

### General Features
- ✅ Secure JWT-based authentication
- ✅ Role-based access control (Student, Instructor, Admin)
- ✅ User profile management
- ✅ Course search and filtering
- ✅ Responsive design with Tailwind CSS
- ✅ Error handling and validation
- ✅ CORS support for multiple origins

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js with TypeScript (97.7%)
- **Framework:** Express.js v5.2.1
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS, bcryptjs
- **Validation:** express-validator
- **File Handling:** Multer
- **Logging:** Morgan
- **Environment Management:** dotenv

### Frontend
- **Framework:** Next.js v16.2.4
- **Language:** TypeScript (97.7%)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4 (2.0%)
- **Form Management:** React Hook Form with Zod validation
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query v5
- **HTTP Client:** Axios
- **UI Components:** shadcn/ui with Lucide icons
- **Notifications:** Sonner & React Hot Toast
- **Themes:** next-themes

---

## 🏗️ Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Frontend)                     │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App Router (Pages/Components) - TypeScript             │
│  ├─ Authentication Pages                                        │
│  ├─ Course Discovery & Browsing                                 │
│  ├─ Student Dashboard                                           │
│  ├─ Instructor Dashboard                                        │
│  ├─ Course Viewing & Lessons                                    │
│  ├─ Quiz Interface                                              │
│  └─ Profile Management                                          │
├─────────────────────────────────────────────────────────────────┤
│  State Management (Zustand) | Data Caching (React Query)        │
├─────────────────────────────────────────────────────────────────┤
│  HTTP Client Layer (Axios with API Interceptors)                │
├─────────────────────────────────────────────────────────────────┤
│                    NETWORK LAYER (HTTPS)                        │
├─────────────────────────────────────────────────────────────────┤
│                  SERVER LAYER (Backend/API)                     │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Server (TypeScript - 97.7%)                         │
│  ├─ Authentication Routes & Middleware                          │
│  ├─ Course Management Routes                                    │
│  ├─ Student Progress Tracking Routes                            │
│  └─ Quiz Management Routes                                      │
├─────────────────────────────────────────────────────────────────┤
│  Business Logic Layer (Controllers)                             │
│  ├─ authController                                              │
│  ├─ courseController                                            │
│  ├─ progressController                                          │
│  └─ quizController                                              │
├─────────────────────────────────────────────────────────────────┤
│  Data Access Layer (Models)                                     │
│  ├─ User Model                                                  │
│  ├─ Course Model                                                │
│  ├─ Progress Model                                              │
│  └─ Quiz Model                                                  │
├─────────────────────────────────────────────────────────────────┤
│                DATABASE LAYER (MongoDB)                         │
├─────────────────────────────────────────────────────────────────┤
│  Collections: users | courses | progress | quizzes              │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌─────────────────┐
│   Frontend      │
│   (Next.js/TS)  │
└────────┬────────┘
         │ HTTP Request
         │ (JWT Token)
         ▼
┌──────────────────────────────────────────┐
│    API Gateway & Middleware              │
│  ├─ CORS Handler                         │
│  ├─ Authentication Middleware            │
│  ├─ Authorization/RBAC                   │
│  ├─ Input Validation                     │
│  └─ Error Handler                        │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│    Route Handlers (Controllers)          │
│  ├─ Auth Controller                      │
│  ├─ Course Controller                    │
│  ├─ Progress Controller                  │
│  └─ Quiz Controller                      │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│    Database Models (Mongoose)            │
│  ├─ User Schema                          │
│  ├─ Course Schema                        │
│  ├─ Progress Schema                      │
│  └─ Quiz Schema                          │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│    MongoDB Database                      │
│  ├─ users collection                     │
│  ├─ courses collection                   │
│  ├─ progress collection                  │
│  └─ quizzes collection                   │
└──────────────────────────────────────────┘
```

### Component Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                        APP STRUCTURE                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              FRONTEND (Next.js + TypeScript)            │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │                                                         │  │
│  │  ┌────────────────┐  ┌─────────────────────────────┐   │  │
│  │  │   Auth Pages   │  │    Dashboard Pages          │   │  │
│  │  ├────────────────┤  ├─────────────────────────────┤   │  │
│  │  │ • Login        │  │ • Instructor Dashboard      │   │  │
│  │  │ • Register     │  │ • Student Dashboard         │   │  │
│  │  │ • Profile      │  │ • Course Management         │   │  │
│  │  └────────────────┘  └─────────────────────────────┘   │  │
│  │                                                         │  │
│  │  ┌────────────────┐  ┌─────────────────────────────┐   │  │
│  │  │  Course Pages  │  │    Learning Pages           │   │  │
│  │  ├────────────────┤  ├─────────────────────────────┤   │  │
│  │  │ • Browse       │  │ • Lesson Viewer             │   │  │
│  │  │ • Details      │  │ • Video Player              │   │  │
│  │  │ • Enroll       │  │ • Progress Tracker          │   │  │
│  │  └────────────────┘  │ • Quiz Interface            │   │  │
│  │                      └─────────────────────────────┘   │  │
│  │                                                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │   Shared State (Zustand Store)                   │  │  │
│  │  │  • Authentication State                          │  │  │
│  │  │  • User Profile                                  │  │  │
│  │  │  • Course Cache                                  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │   React Query (Data Fetching & Caching)          │  │  │
│  │  │  • Query Hooks                                   │  │  │
│  │  │  • Mutation Hooks                                │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           BACKEND (Express.js + TypeScript)            │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │      Routes & Middleware Layer                  │   │  │
│  │  │  • auth.ts       - Authentication routes        │   │  │
│  │  │  • courses.ts    - Course management routes     │   │  │
│  │  │  • progress.ts   - Progress tracking routes     │   │  │
│  │  │  • quizzes.ts    - Quiz management routes       │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │      Controllers (Business Logic)               │   │  │
│  │  │  • authController                               │   │  │
│  │  │  • courseController                             │   │  │
│  │  │  • progressController                           │   │  │
│  │  │  • quizController                               │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │      Models & Database Layer                    │   │  │
│  │  │  • User Model                                   │   │  │
│  │  │  • Course Model                                 │   │  │
│  │  │  • Progress Model                               │   │  │
│  │  │  • Quiz Model                                   │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │      Middleware                                 │   │  │
│  │  │  • auth.ts - JWT verification & RBAC            │   │  │
│  │  │  • errorHandler.ts - Global error handling      │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           DATA LAYER (MongoDB)                          │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │  • users collection        - User accounts & profiles   │  │
│  │  • courses collection      - Course data & lessons      │  │
│  │  • progress collection     - Student progress tracking  │  │
│  │  • quizzes collection      - Quiz & assessment data     │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
HouseOfEdtech/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.ts     # Auth logic (register, login)
│   │   │   ├── courseController.ts   # Course management
│   │   │   ├── progressController.ts # Student progress tracking
│   │   │   └── quizController.ts     # Quiz management
│   │   ├── middleware/
│   │   │   ├── auth.ts               # Authentication & authorization
│   │   │   └── errorHandler.ts       # Global error handling
│   │   ├── models/
│   │   │   ├── User.ts               # User schema
│   │   │   ├── Course.ts             # Course & Lesson schemas
│   │   │   ├── Progress.ts           # Student progress schema
│   │   │   └── Quiz.ts               # Quiz schema
│   │   ├── routes/
│   │   │   ├── auth.ts               # Auth endpoints
│   │   │   ├── courses.ts            # Course endpoints
│   │   │   ├── progress.ts           # Progress endpoints
│   │   │   └── quizzes.ts            # Quiz endpoints
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript interfaces
│   │   └── index.ts                  # Server entry point
│   ├── dist/                         # Compiled JavaScript output
│   ├── .env.example                  # Environment variables template
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── (instructor)/
│   │   │   │   ├── courses/page.tsx
│   │   │   │   ├── create-course/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── (student)/
│   │   │   │   ├── courses/page.tsx
│   │   │   │   ├── enrolled/page.tsx
│   │   │   │   └── [id]/learn/page.tsx
│   │   │   └── layout.tsx
│   │   ├── courses/
│   │   │   ├── page.tsx               # Course listing
│   │   │   ├── [id]/page.tsx          # Course detail
│   │   │   └── [id]/lesson/[lessonId]/page.tsx
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Home page
│   ├── components/
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── common/
│   │   └── ui/
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── api.ts                     # API client
│   │   └── utils.ts
│   ├── store/
│   │   └── authStore.ts               # Zustand store
│   ├── styles/
│   │   └── globals.css
│   ├── .env.local.example
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── README.md
│
└── README.md                          # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB instance (local or cloud)

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/AkramCodeer/HouseOfEdtech.git
cd HouseOfEdtech
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Edit .env with:
# - MONGO_URI=your_mongodb_connection_string
# - JWT_SECRET=your_jwt_secret_key
# - PORT=5000
# - NODE_ENV=development

# Start development server
npm run dev
# or build and start
npm run build
npm start
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Configure environment variables
# Edit .env.local with:
# - NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start development server
npm run dev
# or build and start
npm run build
npm start
```

#### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "student" | "instructor"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "enrolledCourses": [...]
  }
}
```

#### Update Profile
```http
PATCH /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "Software Developer",
  "avatar": "https://..."
}
```

---

### Course Endpoints

#### Get All Courses (Paginated, Searchable)
```http
GET /courses?page=1&limit=10&search=javascript&category=programming&level=beginner
```

**Response (200):**
```json
{
  "success": true,
  "courses": [
    {
      "_id": "course_id",
      "title": "Learn JavaScript Basics",
      "description": "Complete guide to JavaScript",
      "category": "programming",
      "level": "beginner",
      "price": 29.99,
      "instructor": { ... },
      "thumbnail": "https://...",
      "rating": 4.5,
      "totalRatings": 120,
      "enrolledStudents": 500,
      "lessons": [
        {
          "_id": "lesson_id",
          "title": "Variables and Data Types",
          "videoUrl": "https://...",
          "duration": 45
        }
      ]
    }
  ],
  "total": 45,
  "page": 1
}
```

#### Get Course by ID
```http
GET /courses/:id
```

#### Get Instructor's Courses
```http
GET /courses/my-courses
Authorization: Bearer {instructor_token}
```

#### Create Course
```http
POST /courses
Authorization: Bearer {instructor_token}
Content-Type: application/json

{
  "title": "Advanced TypeScript",
  "description": "Learn advanced TypeScript concepts",
  "category": "programming",
  "level": "advanced",
  "price": 49.99,
  "tags": ["typescript", "advanced", "web-development"]
}
```

**Response (201):**
```json
{
  "success": true,
  "course": {
    "_id": "course_id",
    "title": "Advanced TypeScript",
    "instructor": "instructor_id",
    ...
  }
}
```

#### Update Course
```http
PUT /courses/:id
Authorization: Bearer {instructor_token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 59.99
}
```

#### Delete Course
```http
DELETE /courses/:id
Authorization: Bearer {instructor_token}
```

#### Enroll in Course
```http
POST /courses/:id/enroll
Authorization: Bearer {student_token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Enrolled successfully"
}
```

#### Add Lesson to Course
```http
POST /courses/:id/lessons
Authorization: Bearer {instructor_token}
Content-Type: application/json

{
  "title": "Understanding Promises",
  "content": "Lesson content here",
  "videoUrl": "https://example.com/video.mp4",
  "duration": 60,
  "order": 1
}
```

#### Generate Thumbnail
```http
POST /courses/generate-thumbnail
Authorization: Bearer {instructor_token}
Content-Type: multipart/form-data

file: <image_file>
```

---

### Progress Endpoints

#### Get All Progress for User
```http
GET /progress
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "progress": [
    {
      "_id": "progress_id",
      "studentId": "student_id",
      "courseId": "course_id",
      "completedLessons": ["lesson_id_1", "lesson_id_2"],
      "progressPercentage": 60,
      "lastAccessed": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get Progress for Specific Course
```http
GET /progress/:courseId
Authorization: Bearer {token}
```

#### Mark Lesson as Complete
```http
POST /progress/:courseId/lessons/:lessonId/complete
Authorization: Bearer {student_token}
```

**Response (200):**
```json
{
  "success": true,
  "progress": {
    "_id": "progress_id",
    "progressPercentage": 75,
    "completedLessons": [...]
  }
}
```

---

### Quiz Endpoints

#### Get Quizzes for Course
```http
GET /quizzes/course/:courseId
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "quizzes": [
    {
      "_id": "quiz_id",
      "courseId": "course_id",
      "title": "JavaScript Basics Quiz",
      "description": "Test your knowledge",
      "questions": [
        {
          "_id": "question_id",
          "question": "What is a closure?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": 0,
          "explanation": "..."
        }
      ]
    }
  ]
}
```

#### Get Quiz by ID
```http
GET /quizzes/:quizId
Authorization: Bearer {token}
```

#### Create Quiz
```http
POST /quizzes/course/:courseId
Authorization: Bearer {instructor_token}
Content-Type: application/json

{
  "title": "Final Assessment",
  "description": "Test your knowledge",
  "questions": [
    {
      "question": "What is async/await?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "..."
    }
  ]
}
```

#### Generate AI Quiz
```http
POST /quizzes/course/:courseId/generate-ai
Authorization: Bearer {instructor_token}
Content-Type: application/json

{
  "lessonContent": "Lesson text content",
  "numberOfQuestions": 5,
  "difficulty": "medium"
}
```

#### Submit Quiz
```http
POST /quizzes/:quizId/submit
Authorization: Bearer {student_token}
Content-Type: application/json

{
  "answers": [
    {
      "questionId": "question_id_1",
      "selectedAnswer": 0
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "result": {
    "_id": "result_id",
    "quizId": "quiz_id",
    "studentId": "student_id",
    "score": 85,
    "totalQuestions": 10,
    "correctAnswers": 8.5,
    "submittedAt": "2024-01-15T11:00:00Z",
    "answers": [...]
  }
}
```

---

### Health Check

```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

---

## 🗄️ Database Models

### User Model
```typescript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, encrypted),
  role: String (enum: ['admin', 'instructor', 'student'], default: 'student'),
  avatar: String (optional),
  bio: String (optional, max 500 chars),
  enrolledCourses: [ObjectId] (references Course),
  createdAt: Date,
  updatedAt: Date
}
```

### Course Model
```typescript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  thumbnail: String (optional),
  instructor: ObjectId (required, references User),
  category: String (required),
  level: String (enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner'),
  price: Number (default: 0, min: 0),
  lessons: [
    {
      _id: ObjectId,
      title: String (required),
      content: String (required),
      videoUrl: String (optional),
      duration: Number (default: 0),
      order: Number (required)
    }
  ],
  enrolledStudents: [ObjectId] (references User),
  tags: [String],
  isPublished: Boolean (default: false),
  rating: Number (default: 0),
  totalRatings: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Progress Model
```typescript
{
  _id: ObjectId,
  studentId: ObjectId (references User),
  courseId: ObjectId (references Course),
  completedLessons: [ObjectId],
  progressPercentage: Number (0-100),
  lastAccessed: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Quiz Model
```typescript
{
  _id: ObjectId,
  courseId: ObjectId (references Course),
  title: String (required),
  description: String,
  questions: [
    {
      _id: ObjectId,
      question: String (required),
      options: [String] (required),
      correctAnswer: Number (required),
      explanation: String
    }
  ],
  createdBy: ObjectId (references User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "userId": "user_id",
  "role": "student|instructor|admin",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Access Control

| Endpoint | Public | Student | Instructor | Admin |
|----------|--------|---------|------------|-------|
| GET /courses | ✅ | ✅ | ✅ | ✅ |
| POST /courses | ❌ | ❌ | ✅ | ✅ |
| PUT /courses/:id | ❌ | ❌ | ✅ | ✅ |
| DELETE /courses/:id | ❌ | ❌ | ✅ | ✅ |
| POST /courses/:id/enroll | ❌ | ✅ | ❌ | ✅ |
| POST /quizzes/course/:id | ❌ | ❌ | ✅ | ✅ |
| POST /quizzes/:id/submit | ❌ | ✅ | ✅ | ✅ |
| GET /progress/:id | ❌ | ✅ | ✅ | ✅ |

---

## 🔗 API Integration Guide

### Frontend API Client Setup

```typescript
// lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Example: Fetch Courses

```typescript
import api from '@/lib/api';

const fetchCourses = async (page = 1) => {
  const response = await api.get(`/courses?page=${page}`);
  return response.data.courses;
};
```

---

## 📝 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/houseoedtech
# or MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/houseoedtech

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000

# File Upload (Optional)
MAX_FILE_SIZE=10mb

# API Configuration
API_VERSION=v1
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
# For production
# NEXT_PUBLIC_API_URL=https://api.houseoedtech.com
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📦 Deployment

### Deploy Backend (Vercel, Heroku, AWS, etc.)

1. Set environment variables on the platform
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set start command: `npm start`

### Deploy Frontend (Vercel, Netlify, etc.)

1. Set `NEXT_PUBLIC_API_URL` environment variable
2. Connect GitHub repository
3. Vercel automatically detects Next.js and deploys

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write clear commit messages
- Test your changes before pushing
- Update documentation as needed

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👥 Support

For support, email support@houseoedtech.com or open an issue on GitHub.

---

## 🙏 Acknowledgments

- Built with ❤️ by the House of Edtech team
- Thanks to all contributors and users
- Inspired by modern LMS platforms

---

## 📞 Contact

- **GitHub:** [@AkramCodeer](https://github.com/AkramCodeer)
- **Live Site:** [house-of-edtech-virid.vercel.app](https://house-of-edtech-virid.vercel.app)
- **Repository:** [AkramCodeer/HouseOfEdtech](https://github.com/AkramCodeer/HouseOfEdtech)

---

**Last Updated:** June 2026 | **Language Composition:** TypeScript 97.7% | CSS 2% | JavaScript 0.3%
