// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuXW_Y9jHVPWplqTXy98mOFP1Ad6GzJOI",
    authDomain: "interlagos-conectado.firebaseapp.com",
    projectId: "interlagos-conectado",
    storageBucket: "interlagos-conectado.firebasestorage.app",
    messagingSenderId: "536656072422",
    appId: "1:536656072422:web:b01145cab66d03e0843527",
    measurementId: "G-TVH10B8GK4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Services
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize App Check (Uncomment and add site key when ready)
// const appCheck = initializeAppCheck(app, {
//     provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
//     isTokenAutoRefreshEnabled: true
// });

export { db, auth, analytics, googleProvider };
// export { appCheck };