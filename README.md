# SheEarn – Women Skill to Income Platform
> "Turn Skills into Income – Empowering Women Everywhere"

## 🏗️ Architecture Overview

```
Frontend (React + Tailwind) ←→ Backend (Spring Boot REST) ←→ MongoDB
                                        ↕
                               JWT Security Layer
                                        ↕
                            AI Skill Analysis (Rule-based)
                            SOS Alert System (Mock SMS)
                            Location-Based Matching
```

## 📁 Folder Structure

```
shearn/
├── backend/                   Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/shearn/
│       ├── ShearnApplication.java
│       ├── config/SecurityConfig.java
│       ├── controller/
│       │   ├── AuthController.java      POST /api/auth/signup, /login
│       │   ├── GigController.java       CRUD /api/gigs/**
│       │   ├── UserController.java      GET/PUT /api/users/**
│       │   ├── SkillAnalysisController  POST /api/skills/analyze
│       │   └── SosController.java       POST /api/sos/trigger
│       ├── service/
│       │   ├── AuthService.java
│       │   ├── GigService.java
│       │   ├── UserService.java
│       │   ├── SkillAnalysisService.java  ← AI logic here
│       │   └── SosService.java
│       ├── model/
│       │   ├── User.java, Gig.java, Review.java
│       │   ├── SosAlert.java, SkillAnalysis.java
│       ├── repository/ (Spring Data MongoDB)
│       ├── security/JwtUtil.java, JwtFilter.java
│       └── dto/AuthDto.java, GigDto.java
│
└── frontend/                  React application
    ├── src/
    │   ├── App.jsx             Router setup
    │   ├── context/AuthContext.jsx
    │   ├── services/api.js     Axios API calls
    │   ├── pages/
    │   │   ├── LandingPage.jsx    Hero + Features + CTA
    │   │   ├── LoginPage.jsx      With voice input 🎤
    │   │   ├── SignupPage.jsx     Role selector
    │   │   ├── Dashboard.jsx      Stats + Gig management
    │   │   ├── GigsPage.jsx       Browse + Filter + Urgent
    │   │   ├── SkillAnalyzerPage  AI analysis UI 🤖
    │   │   ├── PostGigPage.jsx    Create new gig
    │   │   └── ProfilePage.jsx    Edit + Emergency contact
    │   └── components/layout/Navbar.jsx (with SOS button)
```

## 🚀 Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- MongoDB (running on localhost:27017)
- Maven 3.8+

---

### Step 1: Start MongoDB
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# Or use MongoDB Atlas (cloud) - update URI in application.properties
```

---

### Step 2: Run the Backend (Spring Boot)
```bash
cd shearn/backend

# Build and run
mvn spring-boot:run

# OR build jar and run
mvn clean package -DskipTests
java -jar target/shearn-backend-1.0.0.jar
```

Backend starts at: **http://localhost:8080**

---

### Step 3: Run the Frontend (React)
```bash
cd shearn/frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend starts at: **http://localhost:3000**

---

## 🔑 API Endpoints Reference

### Auth (Public)
```
POST /api/auth/signup   { name, email, password, role, phone, city }
POST /api/auth/login    { email, password }
```

### Gigs
```
GET  /api/gigs/public              Browse all open gigs
GET  /api/gigs/urgent              Urgent gigs only
GET  /api/gigs/public/{id}         Single gig
GET  /api/gigs/public/category/{c} Filter by category
GET  /api/gigs/nearby?lat=&lng=    Location-based gigs
POST /api/gigs                     Create gig (auth)
GET  /api/gigs/my?view=provider    My gigs (auth)
POST /api/gigs/{id}/accept         Accept gig (auth, woman)
PATCH /api/gigs/{id}/start         Start gig (auth)
PATCH /api/gigs/{id}/complete      Complete gig (auth)
POST /api/gigs/{id}/review         Leave review (auth)
```

### Users
```
GET   /api/users/me                My profile (auth)
PUT   /api/users/me                Update profile (auth)
PATCH /api/users/me/location       Update location (auth)
GET   /api/users/me/dashboard      Provider dashboard stats
GET   /api/users/providers         All providers
GET   /api/users/providers/nearby?lat=&lng=
GET   /api/users/{id}              Public profile
```

### AI Skills
```
POST /api/skills/analyze   { category, imageUrl } → Analysis result
GET  /api/skills/my        My analysis history
```

### SOS Safety
```
POST  /api/sos/trigger        { latitude, longitude, message }
PATCH /api/sos/{id}/resolve
GET   /api/sos/my             My SOS history
```

---

## 🔐 Authentication
All protected endpoints require: `Authorization: Bearer <JWT_TOKEN>`

JWT token is returned from login/signup and stored in localStorage.

---

## 🧪 Quick Test (curl)

```bash
# Signup
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Priya","email":"priya@test.com","password":"pass123","role":"WOMAN","city":"Delhi"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"priya@test.com","password":"pass123"}'

# Browse gigs (no auth)
curl http://localhost:8080/api/gigs/public

# AI Analyze (auth required)
curl -X POST http://localhost:8080/api/skills/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category":"COOKING","imageUrl":"test.jpg"}'
```

---

## 🌟 Key Features Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| JWT Auth (Signup/Login) | ✅ | Spring Security + BCrypt |
| User Roles (Woman/Customer) | ✅ | Role-based access |
| AI Skill Analyzer | ✅ | Rule-based mock AI |
| Instant Job Matching | ✅ | Location-based filter |
| Urgent Jobs Section | ✅ | Flagged gigs on homepage |
| SOS Safety Button | ✅ | In Navbar + Dashboard |
| Verified User Badge | ✅ | Shown on profiles |
| Rating & Reviews | ✅ | Post-completion flow |
| Voice Input (Web Speech) | ✅ | Login + Gig search |
| Location-Based Matching | ✅ | GPS + lat/lng filter |
| Micro-Gigs Booking | ✅ | Full booking lifecycle |
| Women Dashboard | ✅ | Earnings, jobs, ratings |
| Responsive UI | ✅ | Mobile + Desktop |
| MongoDB Integration | ✅ | All documents |

---

## 🎨 UI Design

- Font: Playfair Display (headings) + DM Sans (body)
- Colors: Rose (primary) + Violet (accent) + Emerald (success)
- Style: Startup-clean with cards, rounded corners, smooth animations
- Mobile-first responsive design

---

*Built for hackathon demo — SheEarn 2024*
