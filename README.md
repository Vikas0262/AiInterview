# AI Interview Platform

A modern web application for conducting AI-powered interviews with user authentication and a seamless interview experience.

## Features

### Authentication
- User registration and login
- Social login with Google and GitHub
- Secure password hashing
- JWT-based authentication
- Protected routes

### User Interface
- Responsive design
- Clean and modern interface
- Interactive authentication modal
- Loading states and error handling
- Smooth animations and transitions

### Interview Features
- [Feature 1 - Coming Soon]
- [Feature 2 - Coming Soon]
- [Feature 3 - Coming Soon]

## Tech Stack

### Frontend
- React.js
- Tailwind CSS for styling
- React Icons
- React Toastify for notifications
- Axios for API requests
- Firebase Authentication

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- CORS enabled

### Authentication
- Firebase Authentication
- Google OAuth
- GitHub OAuth

## Getting Started

### Prerequisites
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
