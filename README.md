# Advanced Real-Time Emotion Analyzer for Video Calls




## Introduction
This project is a web-based real-time video calling platform enhanced with advanced facial analysis features such as emotion recognition, emoji overlay, and face swapping. It uses WebRTC for peer-to-peer video communication and integrates lightweight machine learning models in-browser to analyze facial expressions and respond dynamically in real time.

## Features
1. **Real-Time Video Calls**  
   - WebRTC-powered peer-to-peer video calling with room-based architecture.  
   - Socket.io used for signaling.  
   - Google OAuth for secure user authentication.

2. **Call Logs**  
   - User call history stored in a relational (PostgreSQL) or NoSQL (MongoDB) database.

3. **Face Detection and Tracking**  
   - MediaPipe FaceMesh detects and tracks 468 facial landmarks directly in the browser.

4. **Emotion Recognition**  
   - A lightweight MLP model trained using FER2013 dataset.  
   - Real-time emotion classification based on facial landmark positions.  
   - Deployed using TensorFlow.js.

5. **Emoji Overlay**  
   - Overlay emoji images on users' faces using HTML5 Canvas based on detected emotion and face tracking.

6. **Face Swapping**  
   - Real-time 3D face mesh reconstruction using Three.js.  
   - Custom or preset faces can be mapped onto the user’s face, following their expressions.

7. **Optimization**  
   - Focus on low-latency and efficiency.  
   - In-browser ML processing ensures data privacy and faster inference.

8. **Deployment**  
   - Dockerized application deployed on a cloud server.

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- JavaScript

### Backend
- Node.js
- Express.js
- Socket.io
- TensorFlow.js
- PostgreSQL or MongoDB

### Machine Learning
- Python
- PyTorch (for training)
- TensorFlow.js (for inference)

## System Architecture

1. **Client-side**
   - React application handles UI, MediaPipe for facial tracking.
   - TensorFlow.js runs the MLP model for real-time emotion detection.
   - HTML5 Canvas for emoji rendering and Three.js for face swapping.

2. **Server-side**
   - Node.js + Express.js handles API requests and Socket.io handles signaling.
   - Google OAuth is used for authentication.
   - PostgreSQL or MongoDB stores call logs.

## Setup Instructions

### Prerequisites
- Node.js and npm
- Docker (for deployment)
- Python (for ML training)
- MongoDB or PostgreSQL

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/emotion-analyzer-video-call.git
   cd emotion-analyzer-video-call
   ```

2. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in both `server/` and `client/` directories with the following (example):

   **server/.env**
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   DATABASE_URL=your_postgres_or_mongo_uri
   PORT=5000
   ```

   **client/.env**
   ```env
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

## Running the Project

### 1. Start Backend
In a terminal window:
```bash
cd server
npm run dev
```

### 2. Start Frontend
In another terminal window:
```bash
cd client
npm start
```
