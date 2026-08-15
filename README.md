# 🚀 CareerLens AI

> **AI-powered Resume Analysis, Interview Preparation & Job Matching Platform**

CareerLens AI is a full-stack AI-powered career assistant that helps users analyze their resumes, identify relevant skills, prepare for interviews, and discover suitable career opportunities.

The application combines a modern React frontend with a FastAPI backend and Google's Gemini AI to provide intelligent resume analysis and career guidance.

---

## 🌐 Live Demo

### 🎨 Frontend

🔗 https://careerlensai-sandhesha-pnb8.onrender.com

### ⚙️ Backend API

🔗 https://careerlensai-sandhesha.onrender.com

### ❤️ Backend Health Check

🔗 https://careerlensai-sandhesha.onrender.com/health

---

## ✨ Features

### 📄 Resume Analysis

Upload your PDF resume and CareerLens AI will:

- Extract resume text automatically
- Analyze your professional profile
- Identify technical skills
- Generate a resume score
- Provide personalized feedback
- Highlight areas for improvement

### 🤖 AI-Powered Analysis

Uses Google Gemini AI to analyze resume information and provide intelligent career recommendations.

The AI can evaluate:

- Technical skills
- Projects
- Education
- Certifications
- Career profile
- Resume quality
- Areas for improvement

### 🎯 Job Matching

CareerLens AI can match a user's profile with suitable job opportunities based on:

- Skills
- Technologies
- Experience
- Career interests
- Resume information

### 🎤 Interview Preparation

The platform provides interview preparation features including:

- Technical interview questions
- Role-based questions
- AI-generated interview preparation
- Career-focused preparation

### ⚙️ User Settings

Users can manage:

- Name
- Email
- Career goal
- Location
- Work type
- Job notifications
- Interview notifications
- Dark mode

### 🔔 Notifications

CareerLens AI supports career-related notification functionality for:

- Job opportunities
- Interview preparation
- User updates

### 📱 Responsive UI

The frontend is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────────┐
                    │       User / Browser     │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     React + Vite         │
                    │       Frontend           │
                    │                          │
                    │  Resume Upload            │
                    │  Dashboard                │
                    │  Job Matching             │
                    │  Interview Preparation    │
                    │  Settings                 │
                    └────────────┬─────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌──────────────────────────┐
                    │       FastAPI             │
                    │        Backend            │
                    │                          │
                    │  Resume Routes             │
                    │  Jobs Routes               │
                    │  Interview Routes          │
                    │  Settings Routes           │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
          ┌──────────────────┐      ┌──────────────────┐
          │  PDF Processing  │      │   Gemini AI      │
          │                  │      │                  │
          │  Resume Parser   │      │ AI Analysis      │
          │  Text Extraction │      │ Recommendations  │
          └──────────────────┘      └──────────────────┘
