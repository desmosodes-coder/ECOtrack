import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = window.auth;
const db = window.db;

// Sign Up Student
function studentSignUp() {
  const email = document.getElementById("student-email").value;
  const password = document.getElementById("student-password").value;
  const error = document.getElementById("signup-error");

  error.textContent = "";

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Save to Firestore: pending verification
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        role: "student",
        verified: false,
        createdAt: new Date(),
      });

      alert("Account created! Awaiting teacher verification.");
    })
    .catch((err) => {
      error.textContent = err.message;
    });
}

// Sign In Student
function studentSignIn() {
  const email = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;
  const error = document.getElementById("signin-error");

  error.textContent = "";

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        error.textContent = "No profile found.";
        return;
      }

      const userData = userDoc.data();

      if (!userData.verified) {
        error.textContent = "Not verified by teacher yet.";
        return;
      }

      // Verified → go to main site
      window.location.href = "Echo3.html";
    })
    .catch((err) => {
      error.textContent = err.message;
    });
}

// Check if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Check verification status
    getDoc(doc(db, "users", user.uid))
      .then((docSnap) => {
        if (docSnap.exists() && docSnap.data().verified) {
          window.location.href = "Echo3.html";
        }
      });
  }
});
