// ----------------------------------------------------------------
// FILENAME: firebase.js
// DESCRIPTION: Central Firebase configuration and initialization.
// ----------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration using your provided project details
const firebaseConfig = {
  apiKey: "AIzaSyD0_JhrMpCR5Xnzkg2Tij1zFD1FSAhhwvs",
  authDomain: "study-portal-82f2d.firebaseapp.com",
  projectId: "study-portal-82f2d",
  storageBucket: "study-portal-82f2d.firebasestorage.app",
  messagingSenderId: "293706317336",
  appId: "1:293706317336:web:506c9b2ac8c642974f0d6d",
  measurementId: "G-ZLLCZ5HCB9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporting services for use in other modules
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Firebase initialized successfully.");