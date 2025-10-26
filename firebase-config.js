// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvblGiAIZ26bIbtw6cSv9kfgzSiYyq_10",
  authDomain: "registar-5f3fb.firebaseapp.com",
  projectId: "registar-5f3fb",
  storageBucket: "registar-5f3fb.firebasestorage.app",
  messagingSenderId: "856198150739",
  appId: "1:856198150739:web:801000f564b47f6333e4a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };