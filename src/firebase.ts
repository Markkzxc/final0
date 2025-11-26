// finals/src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Web Config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAy42AnooL331nQ9s0zquhMflnIAZV7wbA",
  authDomain: "finalwebproject-6d08e.firebaseapp.com",
  projectId: "finalwebproject-6d08e",
  storageBucket: "finalwebproject-6d08e.appspot.com",
  messagingSenderId: "1021601611978",
  appId: "1:1021601611978:web:0329f407173763ecadb433",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth instance
export const auth = getAuth(app);
export const db = getFirestore(app)
