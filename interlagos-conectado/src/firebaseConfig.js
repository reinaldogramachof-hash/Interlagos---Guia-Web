// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCuXW_Y9jHVPWplqTXy98mOFP1Ad6GzJOI",
    authDomain: "interlagos-conectado.firebaseapp.com",
    projectId: "interlagos-conectado",
    storageBucket: "interlagos-conectado.firebasestorage.app",
    messagingSenderId: "536656072422",
    appId: "1:536656072422:web:b01145cab66d03e0843527",
    measurementId: "G-TVH10B8GK4"
};

let app;
let analytics;
let db;
let auth;
let googleProvider;

try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    db = getFirestore(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

export { db, auth, analytics, googleProvider };
