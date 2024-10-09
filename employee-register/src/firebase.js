import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQfxpv1n8lcb0SHsn9y4DvhN2kTYc9kis",
  authDomain: "employee-node-6d9ec.firebaseapp.com",
  projectId: "employee-node-6d9ec",
  storageBucket: "employee-node-6d9ec.appspot.com",
  messagingSenderId: "951749396320",
  appId: "1:951749396320:web:6bf987d04f2bfc03af8005",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
