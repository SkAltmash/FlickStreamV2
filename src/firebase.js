// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCOr_jny435V70RQeGSxrx8gVt6ly2Uhn0",
  authDomain: "flickstreemv2.firebaseapp.com",
  projectId: "flickstreemv2",
  storageBucket: "flickstreemv2.firebasestorage.app",
  messagingSenderId: "1003231306221",
  appId: "1:1003231306221:web:8080a6457f18e300d2c7e4",
  measurementId: "G-F6GV4HQX1L"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
