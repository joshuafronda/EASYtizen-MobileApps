// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';  // Add this for Firestore
import { getAuth } from 'firebase/auth';  // Add this import

// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey: "AIzaSyCoKGads7BNJBG5lcUTZLPi59NnwZmeqNA",
  authDomain: "fir-config-6ca5c.firebaseapp.com",
  databaseURL: "https://fir-config-6ca5c-default-rtdb.firebaseio.com",
  projectId: "fir-config-6ca5c",
  storageBucket: "fir-config-6ca5c.firebasestorage.app",
  messagingSenderId: "395068353763",
  appId: "1:395068353763:web:ea3ec46d3fac9ac109a9d6",
  measurementId: "G-BBRTC7BFHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);  // Initialize Firestore

const auth = getAuth(app);  // Initialize Authentication

export { app, db, analytics, auth };