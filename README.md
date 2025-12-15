

# 📁 My-Drive — Full Stack File Management System

My-Drive is a **full-stack cloud file management web application** inspired by Google Drive.
It allows users to securely upload, manage, and organize files with proper authentication, access control, and cloud storage integration.

🔗 **Live Demo:** [https://my-drive-vi6k.onrender.com](https://my-drive-vi6k.onrender.com)
🔗 **GitHub Repo:** [https://github.com/AkshatGupta-18/My-Drive](https://github.com/AkshatGupta-18/My-Drive)

---

## 🚀 Features

* User authentication using **JWT stored in HTTP-only cookies**
* Secure user sessions with protected routes
* File upload, download, and deletion
* Folder-based file organization
* Cloud file storage using **Supabase Storage**
* User and file metadata management with **MongoDB**
* Backend validation and access control to prevent unauthorized access
* Production deployment with environment-based configuration

---

## 🛠 Tech Stack

### Frontend

* HTML, CSS, JavaScript
  *(or React, if frontend is React — update honestly)*

### Backend

* **Node.js**
* **Express.js**
* RESTful APIs
* JWT authentication
* Cookie-based session handling

### Database & Storage

* **MongoDB** – user data and file metadata
* **Supabase Storage** – cloud file storage

### Deployment

* **Render** (backend hosting)
* Environment variables for secrets and configuration

---

## 🔐 Authentication Flow (Important)

1. User registers or logs in
2. Server generates a **JWT**
3. JWT is stored in an **HTTP-only cookie**
4. Cookie is sent automatically with every request
5. Protected routes validate the token before allowing access

Why HTTP-only cookies?

* Prevents access from JavaScript
* Reduces XSS attack surface
* More secure than localStorage for auth tokens

---

## 📂 File Handling Flow

1. User uploads a file
2. Backend validates authentication and file ownership
3. File is uploaded to **Supabase Storage**
4. File metadata (name, path, owner, timestamps) is stored in MongoDB
5. Access is restricted so users can only view/manage their own files

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

---

## ▶️ Run Locally

```bash
git clone https://github.com/AkshatGupta-18/My-Drive.git
cd My-Drive
npm install
npm start
```

Server will run at:

```
http://localhost:5000
```

---

## 📌 Future Improvements

* File sharing with permissions (read/write)
* Folder sharing between users
* File size limits and type validation
* Activity logs
* Improved UI/UX
* Role-based access control

---

## 🧠 What This Project Demonstrates

* Real-world authentication and authorization
* Secure backend design
* REST API development
* Cloud storage integration
* Deployment and environment handling
* End-to-end ownership of a full-stack application

---

## 👤 Author

**Akshat Gupta**
GitHub: [https://github.com/AkshatGupta-18](https://github.com/AkshatGupta-18)


