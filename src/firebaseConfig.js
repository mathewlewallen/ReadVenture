import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCF--8pYtlU1wbn_nM8ZG16VelZbWYSTu8",
  authDomain: "readventure11.firebaseapp.com",
  projectId: "readventure11",
  storageBucket: "readventure11.firebasestorage.app",
  messagingSenderId: "798869244380",
  appId: "1:798869244380:web:8b9619d18f96332574a719",
  measurementId: "G-Q9PQS6QB36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);