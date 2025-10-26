import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvblGiAIZ26bIbtw6cSv9kfgzSiYyq_10",
  authDomain: "registar-5f3fb.firebaseapp.com",
  projectId: "registar-5f3fb",
  storageBucket: "registar-5f3fb.firebasestorage.app",
  messagingSenderId: "856198150739",
  appId: "1:856198150739:web:801000f564b47f6333e4a6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Make available globally
window.auth = auth;
window.db = db;
