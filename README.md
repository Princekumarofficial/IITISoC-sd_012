
# MediCall – Advanced Real-Time Emotion Analyzer for Video Calls

An interactive, AI-powered video calling platform that brings **emotions to life** using facial expression recognition, emoji overlays, and live face transformations. Built to redefine how we communicate remotely.

🟢 Live Demo: https://iiti-so-c-frontend.vercel.app

## 🧠 Introduction

MediCall transforms traditional video calls into expressive conversations. By blending **machine learning**, **face tracking**, and **real-time communication**, it allows users to:

- Reflect real-time **emotions** using emoji overlays.
- Swap faces with custom/preset characters live on screen.
- Engage in dynamic, expressive, and secure video calls.

## 🚀 Features

### 🎥 Real-Time Video Calls
- WebRTC-based peer-to-peer video calling.
- Room-based system with unique meeting IDs.
- Integrated with Mediasoup SFU for scalable, multi-user video handling.

### 😀 Real-Time Emotion Recognition
- Browser-based inference using `face-api.js`.
- Live emoji overlays based on facial expressions.
- MLP model trained on FER2013, optimized for web via TensorFlow.js.

### 🧑‍🎤 Face Swapping *(WIP)*
- Real-time face replacement using facial landmarks and 3D modeling (Three.js).
- Initial tests done with SimSwap (ONNX), future plans for stable integration.

### 💬 In-Call Chat
- Real-time global chat using Socket.io.
- Automatic welcome message.
- Chat stored per meeting session.

### 👥 Room Features
- Join via meeting ID—no prior friendship required.
- Google OAuth for secure login.
- Screen sharing and camera/audio testing tools.

### 📈 Analytics & Emotion Logs
- Emotion overlays for each participant.
- Tracks per-participant mood via emoji history.
- Future: mood-based meeting summary, sentiment trends.

## 🛠️ Tech Stack

### Frontend
- **React.js**, **Tailwind CSS**
- Zustand (state), Framer Motion (animations)
- face-api.js (facial landmark & emotion detection)

### Backend
- **Node.js**, **Express.js**, **Socket.io**
- Mediasoup (SFU server)
- MongoDB (meeting/chat data), Firebase (user auth & assets)

### ML/AI
- **FER2013-based emotion classification**
- **TensorFlow.js** for browser inference
- Face landmark tracking using **MediaPipe** + FaceMesh

## 📐 System Architecture

- **Frontend**:  
  Emotion detection, face tracking, and overlays handled in-browser (privacy-first).  
  Uses Socket.io to sync chat & emotion data.

- **Backend**:  
  Express APIs for auth, meeting creation, chat, emotion analytics.  
  Socket.io manages signaling + emotion broadcasting.  
  MongoDB stores sessions and logs.

- **SFU (Mediasoup)**:  
  Central video routing node for multi-user video/audio.  
  Enables bandwidth-efficient group calls.

## ⚙️ Setup Instructions

### Prerequisites
- Node.js
- Python (for ML model training)
- MongoDB or PostgreSQL
- Docker (optional for deployment)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/medicall-video-call.git
cd medicall-video-call
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables

#### backend/.env
```env
PORT=8000
MONGO_URI=your_mongo_uri
REFRESH_TOKEN_SECRET=your_Token secret
ACCESS_TOKEN_SECRET=your_token secret 
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME =your_cloudninary_cloud_name
CLOUDINARY_API_KEY = your_cloudninary_api_key
CLOUDINARY_API_SECRET =your_api_secret
```

#### frontend/.env
```env
VITE_APP_API_URL=https://gotogether-64ny.onrender.com and http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_ID
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_project_bucket;
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_caredentials
VITE_FIREBASE_APP_ID=your_firebase_caredentials
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_caredentials

```

## 🧪 Usage Guide

### 🏁 Start Backend
```bash
cd backend
npm run dev
```

### 💻 Start Frontend
```bash
cd frontend
npm run dev
```

## 📸 Core User Flow

1. **Create Meeting**
   - Click “Create Meeting” → Share generated ID.

2. **Join Meeting**
   - Enter meeting ID → Join real-time video room.

3. **Toggle Emotions**
   - Click "Emotions" → Activate real-time emoji overlays.

4. **Chat**
   - Use sidebar to send messages to all participants.

5. **Leave**
   - Leave time auto-logged for each user.

## 📊 Results

- Emotion overlay latency under **1s**.
- Smooth performance across 3+ clients.
- Chat and emoji logs persist per meeting.
- Face swapping tested (prototype stage).

## 🔮 Future Scope

- 🎶 Add emotion-based background music.
- 🧩 Integrate facial filters and mini-games.
- 📊 Provide analytics dashboard with mood trends.
- 🧠 Improve real-time face swap inference with better models.

## 📃 License

MIT License © Team MediCall – Abhay Lodhi, Pratyush Gupta, Hemant Yadav
