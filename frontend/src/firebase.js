// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBix554v9UEbZ4Ve1SABjemRbaZTQ_su28",
  authDomain: "travelers-need.firebaseapp.com",
  projectId: "travelers-need",
  storageBucket: "travelers-need.firebasestorage.app",
  messagingSenderId: "760252351598",
  appId: "1:760252351598:web:1349ab04032f2884bc527f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; // Export the auth object for use elsewhere
