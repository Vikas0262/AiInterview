// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2sHG06Q9zpD-aamQyz0CbUXiwemq3HIY",
  authDomain: "aiinterview-fec11.firebaseapp.com",
  projectId: "aiinterview-fec11",
  storageBucket: "aiinterview-fec11.firebasestorage.app",
  messagingSenderId: "892592317360",
  appId: "1:892592317360:web:d57802fa03f989076a2c75",
  measurementId: "G-E98G99QP7G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Add additional scopes for GitHub if needed
githubProvider.addScope('user:email');

export { auth, googleProvider, githubProvider, signInWithPopup };
