// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBY94DcDEHM1mo9X8CQs5RGV7znioUHuTk",
  authDomain: "stuman-256b6.firebaseapp.com",
  projectId: "stuman-256b6",
  storageBucket: "stuman-256b6.appspot.com",
  messagingSenderId: "253885695665",
  appId: "1:253885695665:web:282aae8564ddf9d8904490",
  measurementId: "G-D008K252NZ",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
