# SpendWise 💸

SpendWise is a modern **money tracker web application** built with **React**, **Tailwind CSS**, and **JWT authentication**.  
It helps users track expenses, view analytics, and manage transactions through a clean and responsive dashboard.

---

## 🚀 Features

- 🔐 **JWT Authentication**
  - Secure login using JSON Web Tokens
  - Persistent login with token storage
- 📊 **Interactive Dashboard**
  - Expense and savings overview
  - Visual charts for expense analysis
- 📈 **Analytics**
  - Graph-based insights using Chart.js
- 🎨 **Modern UI**
  - Built with Tailwind CSS
  - Smooth animations using Framer Motion
- 📱 **Responsive Design**
  - Works seamlessly across devices
- 🧭 **Collapsible Sidebar Navigation**
  - Clean and intuitive navigation experience

---

## 🛠 Tech Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS**
- **Framer Motion**
- **Axios**
- **Lucide Icons**
- **Chart.js**

### Backend
- **Node.js**
- **Express.js**
- **JWT (jsonwebtoken)**
- **CORS**

---

## 🔐 Authentication Flow

1. User logs in using email and password  
2. Backend validates credentials  
3. Backend issues a **JWT token**  
4. Token is stored in `localStorage`  
5. Token is sent with protected API requests  
6. User remains logged in until logout or token expiry  

---

## 📂 Project Structure

```txt
SpendWise/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── src/
│   ├── components/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
└── README.md
