# 🏫 SchoolOS Pro

A premium school location management system built with **React, Node.js, Express, and MySQL** that allows users to add, search, view, and manage school locations through a clean modern dashboard.

---

## ✨ Features

* ➕ Add new schools with location details
* 🔍 Search schools instantly
* 🗺️ Embedded Google Maps preview for each school
* 🗑️ Delete saved schools
* 🌙 Dark / ☀️ Light mode toggle
* 📊 Premium responsive dashboard UI
* ⚡ Real-time school listing from backend API

---

## 🛠️ Tech Stack

### Frontend

* React
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js
* MySQL

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 📂 Project Structure

frontend/
backend/

---

## ⚙️ Installation

### Clone repository

git clone your-repository-url

### Frontend setup

cd frontend
npm install
npm run dev

### Backend setup

cd backend
npm install
npm run dev

---

## 🗄️ Database Setup

Create MySQL table:

CREATE TABLE schools (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255),
address VARCHAR(255),
latitude FLOAT,
longitude FLOAT
);

---

## 🔗 API Endpoints

### Add School

POST /api/addSchool

### List Schools

GET /api/listSchools

### Delete School

DELETE /api/deleteSchool/:id

---

## 🚀 Live Demo

Frontend deployed on Vercel
Backend deployed on Render

---

## 👨‍💻 Author

Built with focus on clean UI, backend integration, and production deployment.
