import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  setDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = window.auth;
const db = window.db;

// Teacher Login
function teacherLogin() {
  const email = document.getElementById("teacher-email").value;
  const password = document.getElementById("teacher-password").value;
  const error = document.getElementById("teacher-error");

  error.textContent = "";

  // Hardcoded teacher email/password (or you can pre-register teachers)
  if (email === "teacher@school.com" && password === "password123") {
    // Simulate teacher login via Firebase (you can create real teacher account)
    signInWithEmailAndPassword(auth, email, password)
      .catch(async () => {
        // If teacher doesn't exist, create one (first time only)
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          email: email,
          role: "teacher",
          createdAt: new Date(),
        });
      });
  } else {
    error.textContent = "Invalid teacher credentials.";
  }
}

// Teacher Logout
function teacherLogout() {
  signOut(auth).then(() => {
    document.getElementById("dashboard").classList.add("hidden");
  });
}

// Load student verification list
async function loadStudents() {
  const studentList = document.getElementById("student-list");
  studentList.innerHTML = "";

  const q = query(collection(db, "users"), where("role", "==", "student"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.style.margin = "10px 0";
    li.style.padding = "10px";
    li.style.border = "1px solid #ccc";
    li.style.borderRadius = "4px";

    li.innerHTML = `
      ${data.email} - ${data.verified ? '<b>Verified</b>' : 'Pending'}
      ${!data.verified ? `<button onclick="verifyStudent('${docSnap.id}')">Verify</button>` : ''}
    `;
    studentList.appendChild(li);
  });
}

// Verify a student
async function verifyStudent(uid) {
  await updateDoc(doc(db, "users", uid), {
    verified: true
  });
  alert("Student verified!");
  loadStudents();
}

// Auth state change
onAuthStateChanged(auth, (user) => {
  const dashboard = document.getElementById("dashboard");

  if (user) {
    // Check if user is teacher
    getDoc(doc(db, "users", user.uid))
      .then((docSnap) => {
        if (docSnap.exists() && docSnap.data().role === "teacher") {
          dashboard.classList.remove("hidden");
          loadStudents();
        } else {
          signOut(auth);
        }
      });
  } else {
    dashboard.classList.add("hidden");
  }
});
