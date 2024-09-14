import { initializeApp } from "firebase/app";
// import dotenv from 'dotenv'
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// dotenv.config();

const firebaseConfig = {
  apiKey: "AIzaSyCPFJTWkjb8NpQWHm55R4vL26DZaXlHqxA",
  authDomain: "personal-blog-2332.firebaseapp.com",
  projectId: "personal-blog-2332",
  storageBucket: "personal-blog-2332.appspot.com",
  messagingSenderId: "511151835683",
  appId: "1:511151835683:web:ef7cf0537fba523d773f96",
  measurementId: "G-JD39RRQHRB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
