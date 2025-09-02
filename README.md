# OralVis Healthcare — Full Stack Assignment

A full-stack web application for a fictional healthcare provider **OralVis Healthcare**.  
The system supports **two user roles**:  
- **Technicians** → upload patient dental scans.  
- **Dentists** → view scans and generate reports.  

This project demonstrates **authentication, role-based access, database management, file uploads, and frontend integration**.

---

## 🚀 Features

- **User Authentication**
  - Secure login with **bcryptjs** password hashing.
  - **Role-Based Access Control (RBAC)** using JWT.
- **Technician Dashboard**
  - Upload patient scan details (name, ID, type, region, image).
  - Images stored in **Cloudinary**.
- **Dentist Dashboard**
  - View all patient scans in a clean layout.
  - Download **PDF reports** (using jsPDF).
- **Database**
  - SQLite with two tables: `users` and `scans`.
- **Frontend**
  - React + Vite SPA with protected routes.
- **Backend**
  - Node.js + Express REST APIs.

---

## 🛠 Technology Stack

- **Frontend:** React, Vite, React Router, Axios, jsPDF  
- **Backend:** Node.js, Express.js, Multer, JWT, bcryptjs, CORS  
- **Database:** SQLite  
- **Cloud Storage:** Cloudinary (or AWS S3)  

---

## 📂 Project Structure

