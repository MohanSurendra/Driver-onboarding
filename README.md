# Driver Onboarding Portal

A full-stack Driver Onboarding Portal built using the MERN stack (MongoDB, Express.js, React, Node.js) with Tailwind CSS. This application allows drivers to register and complete a multi-step onboarding process, while administrators can manage applications via a dedicated dashboard.

## 🚀 Features

### 🧑‍💼 Driver Side
- Sign Up / Login (JWT Auth)
- Multi-step onboarding form:
  1. Personal Information
  2. Driver Profile (Aadhar, PAN, etc.)
  3. Document Uploads (Aadhar, PAN, DL, RC Book)
  4. Vehicle Information
  5. Final Submission
- OTP verification for email
- View onboarding status (Pending / Approved / Rejected)

### 🛠️ Admin Side
- Secure admin login
- View all driver applications
- Review uploaded documents
- Approve or reject applications

## 🧱 Tech Stack

### Frontend
- React (TypeScript)
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- Multer for file uploads
- express-validator for validation

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/driver-onboarding.git
cd driver-onboarding
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
node index.js
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm start
```

> Ensure the backend is running at the correct port (`http://localhost:5000` or your deployed backend URL).

## 📁 Folder Structure

```
driver-onboarding/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── index.js
│   └── .env
│
├── client/
│   ├── pages/
│   ├── components/
│   ├── utils/
│   ├── App.tsx
│   └── tailwind.config.js
```

## 🧪 API Endpoints

### Auth Routes
- `POST /signup`
- `POST /login`

### Driver Routes
- `POST /driver/basic-info`
- `POST /driver/profile-info`
- `POST /driver/upload-documents`
- `POST /driver/vehicle-info`
- `GET /driver/status/:email`

### Admin Routes
- `GET /admin/drivers`
- `PATCH /admin/status/:id`
- `GET /admin/documents/:filename`

## 📷 Screenshots

_Coming soon — add screenshots or GIFs of the app flow here._

## 📌 To-Do
- Add pagination/search in admin dashboard
- Improve UI for mobile responsiveness
- Add email notifications

## 📃 License

MIT License
