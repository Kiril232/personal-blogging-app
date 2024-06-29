// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import dotenv from 'dotenv'

dotenv.config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "personal-blog-2332.firebaseapp.com",
    projectId: "personal-blog-2332",
    storageBucket: "personal-blog-2332.appspot.com",
    messagingSenderId: "511151835683",
    appId: "1:511151835683:web:ef7cf0537fba523d773f96",
    measurementId: "G-JD39RRQHRB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);