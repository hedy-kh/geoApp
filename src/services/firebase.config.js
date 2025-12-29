// firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgEyKIaqf_HGr_ZWZX48UdHfyJTWpeFPE",
  authDomain: "geoapp-7b9bf.firebaseapp.com",
  projectId: "geoapp-7b9bf",
  storageBucket: "geoapp-7b9bf.firebasestorage.app",
  messagingSenderId: "195091668138",
  appId: "1:195091668138:web:0a35e19d2d2685d4e8c4d3",
  measurementId: "G-LJR1H9XVX4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
