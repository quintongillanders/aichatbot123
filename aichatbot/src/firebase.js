import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDztM5wzgzWksw6gV3B_p59XlJVheQKs8c",
  authDomain: "penpals-ai.firebaseapp.com",
  projectId: "penpals-ai",
  storageBucket: "penpals-ai.firebasestorage.app",
  messagingSenderId: "207403542767",
  appId: "1:207403542767:web:423a012569c66bd045d31a",
  measurementId: "G-MQPKFYF7VC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (optional — safe but not needed for chat apps)
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);