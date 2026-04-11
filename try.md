# MERN-style Frontend + Backend Starter (Without Database)

Ye project ab intentionally **database ke bina** banaya gaya hai taaki tum pehle ye samjho:

* React frontend kaise banta hai
* Express backend API kaise banti hai
* frontend backend ko kaise call karta hai
* backend ko EC2 par aur frontend ko Vercel par kaise deploy karna hai

Is version me:

* **MongoDB nahi hai**
* **Mongoose nahi hai**
* sirf **React + Express** use hua hai
* learning aur deployment dono easy hain

---

## Project Structure

```text
frontend-backend-starter/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── .env
└── frontend/
    ├── package.json
    ├── .env
    └── src/
        ├── App.jsx
        ├── main.jsx
        └── App.css
```

---

# 1) Backend Code

## `backend/package.json`

```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

## `backend/.env`

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Deploy ke baad `FRONTEND_URL` ko Vercel frontend URL se replace karna hoga.

Example:

```env
FRONTEND_URL=https://your-project.vercel.app
```

## `backend/server.js`

```js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/message", (req, res) => {
  res.json({
    success: true,
    message: "Hello from backend",
  });
});

app.post("/api/message", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }

  res.json({
    success: true,
    message: `Hello, ${name}. Your frontend and backend are connected successfully.`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

# 2) Frontend Code

Ye frontend **React + Vite** par based hai.

## `frontend/package.json`

```json
{
  "name": "frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0"
  }
}
```

## `frontend/.env`

```env
VITE_API_URL=http://localhost:5000
```

Deploy ke baad isko backend EC2 URL se replace karna hoga.

Example:

```env
VITE_API_URL=http://13.232.xxx.xxx
```

Agar domain aur SSL lag gaya ho to:

```env
VITE_API_URL=https://api.yourdomain.com
```

## `frontend/src/main.jsx`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## `frontend/src/App.jsx`

```jsx
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [backendMessage, setBackendMessage] = useState("");
  const [name, setName] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const getMessageFromBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/api/message`);
      const data = await response.json();
      setBackendMessage(data.message);
    } catch (error) {
      setBackendMessage("Failed to connect backend");
      console.log(error.message);
    }
  };

  const sendNameToBackend = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      setResponseMessage(data.message);
    } catch (error) {
      setResponseMessage("Failed to send data to backend");
      console.log(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Frontend + Backend Starter</h1>
      <p className="subtitle">React frontend and Express backend connection demo</p>

      <div className="section">
        <h2>GET Request Demo</h2>
        <button onClick={getMessageFromBackend}>Get Message From Backend</button>
        <p>{backendMessage}</p>
      </div>

      <div className="section">
        <h2>POST Request Demo</h2>
        <form onSubmit={sendNameToBackend} className="form">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Send To Backend</button>
        </form>
        <p>{responseMessage}</p>
      </div>
    </div>
  );
}

export default App;
```

## `frontend/src/App.css`

```css
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f4f4f4;
}

.container {
  max-width: 700px;
  margin: 50px auto;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.section {
  margin-bottom: 30px;
  padding: 18px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 10px;
  font-size: 16px;
}

button {
  padding: 10px 14px;
  font-size: 16px;
  cursor: pointer;
}
```

---

# 3) Local Run Steps

## Backend run karo

```bash
cd backend
npm install
npm run dev
```

Backend chalega:

```text
http://localhost:5000
```

## Frontend run karo

```bash
cd frontend
npm install
npm run dev
```

Frontend chalega:

```text
http://localhost:5173
```

---

# 4) Local Testing Flow

## Step 1

Frontend open karo browser me.

## Step 2

`Get Message From Backend` button dabao.

Agar sab sahi hai to backend se message aayega:

```text
Hello from backend
```

## Step 3

Input me apna naam likho aur `Send To Backend` dabao.

Backend response dega:

```text
Hello, YourName. Your frontend and backend are connected successfully.
```

---

# 5) Deploy Ka Real Flow

## Frontend ko Vercel par deploy karna hai

Frontend build hoke Vercel par host hoga.

## Backend ko EC2 par deploy karna hai

Backend Node app EC2 par chalega.

## Connection kaise hoga

Frontend ke `.env` me backend URL rahega:

```env
VITE_API_URL=http://your-ec2-public-ip
```

Aur backend ke `.env` me Vercel frontend URL rahega:

```env
FRONTEND_URL=https://your-project.vercel.app
```

Yahi actual connection hai.

---

# 6) Deployment ke Time Pe Kya Change Karna Hai

## Frontend side

Local:

```env
VITE_API_URL=http://localhost:5000
```

Deploy ke baad:

```env
VITE_API_URL=http://13.233.xxx.xxx
```

Ya domain ho to:

```env
VITE_API_URL=https://api.yourdomain.com
```

## Backend side

Local:

```env
FRONTEND_URL=http://localhost:5173
```

Deploy ke baad:

```env
FRONTEND_URL=https://your-project.vercel.app
```

---

# 7) EC2 Par Backend Deploy Karne Ka Short Flow

```bash
sudo apt update
sudo apt install -y git curl nginx
```

Node install karo, project clone karo, dependencies install karo.

```bash
git clone <backend-repo-url>
cd backend
npm install
npm install -g pm2
pm2 start server.js --name backend
pm2 save
```

Nginx reverse proxy use kar sakte ho ya directly port expose kar sakte ho.

---

# 8) Vercel Par Frontend Deploy Karne Ka Short Flow

* frontend repo GitHub par push karo
* Vercel me import karo
* Environment Variable add karo:

```env
VITE_API_URL=http://your-ec2-public-ip
```

* deploy karo

---

# 9) Common Errors

## CORS error

Agar frontend backend ko hit kar raha hai but browser block kar raha hai, to `FRONTEND_URL` sahi hona chahiye.

## Failed to fetch

Ya to backend run nahi kar raha, ya wrong IP/port use ho raha hai, ya EC2 security group me port open nahi hai.

## Mixed content error

Agar frontend HTTPS pe hai aur backend HTTP pe hai, browser issue de sakta hai. Production me backend pe bhi HTTPS better hota hai.

---

# 10) Ye Project Kyu Useful Hai

Ye project perfect hai agar tum:

* DB ke bina frontend-backend connection samajhna chahte ho
* deployment practice karna chahte ho
* Vercel + EC2 architecture samajhna chahte ho
* CORS aur env variables samajhna chahte ho

---

# 11) One-line Summary

Ye ek simple **React frontend + Express backend** starter hai jise tum locally run karke phir **frontend ko Vercel** aur **backend ko EC2** par deploy karke easily connect kar sakte ho.
