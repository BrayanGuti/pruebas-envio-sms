// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCalgDNSW7moAPUafOzGf92O9vhPCp1mCE",
  authDomain: "m1-firebase-fe987.firebaseapp.com",
  projectId: "m1-firebase-fe987",
  storageBucket: "m1-firebase-fe987.firebasestorage.app",
  messagingSenderId: "158735761390",
  appId: "1:158735761390:web:1217abdb9b6a9e7b1e18ff",
  measurementId: "G-NRTF7JRL16",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log(app);
console.log(auth);
console.log("Firebase initialized.");

// Detect auth state

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const uid = user.uid;
    console.log("User is signed in with UID:", uid);
  } else {
    // User is signed out
    console.log("No user is signed in.");
  }
});
