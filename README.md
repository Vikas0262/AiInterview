# PrepIQ

A modern web application for conducting AI-powered interviews with real-time speech recognition, video capabilities, and a seamless interview experience.

## ✨ Features

### 🎤 Real-time Interview
- AI-powered interview simulation
- Real-time speech-to-text transcription
- Webcam integration for video interviews
- Interactive AI interviewer with natural responses
- Domain-specific interview questions

### 🔒 Authentication & User Management
- Secure user registration and login
- Social login with Google and GitHub
- JWT-based authentication
- Protected routes and session management
- User profile management

### 🎯 Interview Features
- Multiple interview domains (Frontend, Backend, Full Stack, etc.)
- Experience level-based questioning
- Resume parsing for personalized interviews
- Real-time feedback and analysis
- Interview history and performance tracking

### 🎨 User Interface
- Responsive design for all devices
- Clean, modern, and accessible interface
- Interactive UI with smooth animations
- Real-time status indicators
- Dark/light mode support

## 🛠 Tech Stack

### Frontend
- ⚛️ React.js with Vite
- 🎨 Tailwind CSS for styling
- 🔄 React Router for navigation
- 🎤 Web Speech API for speech recognition
- 🎥 WebRTC for video streaming
- 🔥 Firebase Authentication
- 📊 React Toastify for notifications

### Backend
- 🚀 Node.js with Express
- 🗄️ MongoDB with Mongoose
- 🔑 JWT for authentication
- 🔄 RESTful API architecture
- 🌐 CORS enabled
- 🔄 WebSocket for real-time features

### AI & ML
- 🤖 Gemini API for AI responses
- 🗣️ Natural language processing
- 🔍 Context-aware questioning
- 📈 Performance analysis

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- Firebase project for authentication
- Google Cloud API key for Gemini

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vikas0262/AiInterview.git
   cd AiInterview
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   - Create `.env` files in both `backend` and `frontend` directories
   - Add required environment variables (see `.env.example`)

4. **Run the application**
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # In a new terminal, start frontend
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 📝 Environment Variables

### Frontend (`.env`)
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Backend (`.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
NODE_ENV=development
```

## 🏗 Project Structure

```
PrepIQ/
├── frontend/               # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # Source files
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   └── package.json        # Frontend dependencies
│
├── backend/               # Backend Node.js application
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── server.js          # Server entry point
│   └── package.json       # Backend dependencies
│
└── README.md             # This file
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini API](https://ai.google/gemini) for AI capabilities
- [Firebase](https://firebase.google.com/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- All contributors who have helped improve this project

---

<div align="center">
  Made with ❤️ by [Your Name] | 🌟 Star this repository if you find it useful!
</div>
- Node.js (v14 or higher)
- npm
- MongoDB Atlas account or local MongoDB instance
- Firebase project with OAuth configured

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd AI-Project
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update the .env file with your configuration
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Update the .env file with your Firebase config
   npm start
   ```

4. **Environment Variables**

   **Backend (.env)**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

   **Frontend (.env)**
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   ```

## Usage

1. Open the application in your browser (default: http://localhost:3000)
2. Sign up or log in using email/password or social providers
3. [Add specific usage instructions for your interview features]

## Project Structure

```
AI-Project/
├── backend/               # Backend server code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── .env              # Environment variables
│   ├── server.js         # Express server setup
│   └── package.json
│
└── frontend/             # Frontend React application
    ├── public/           # Static files
    └── src/
        ├── assets/      # Images, fonts, etc.
        ├── components/   # Reusable components
        ├── context/     # React context providers
        ├── pages/       # Page components
        ├── services/    # API services
        ├── App.js       # Main App component
        └── index.js     # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
