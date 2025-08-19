// js/auth.js
import { auth } from "./firebase-init.js";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  setPersistence, 
  browserLocalPersistence 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ================= REGISTER ================= */
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered:", userCredential.user);

      // After successful registration → redirect to index.html
      window.location.href = "index.html";
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  });
}

/* ================= LOGIN ================= */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      // Make login persistent
      await setPersistence(auth, browserLocalPersistence);

      // Sign in
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "index.html";
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      console.log("Logout button clicked"); // Debug
      await signOut(auth); // Firebase sign out
      console.log("User signed out successfully"); // Debug
      window.location.href = "login.html"; // Redirect to login page
    } catch (error) {
      console.error("Logout error:", error.message);
      alert("Logout failed: " + error.message);
    }
  });
}

/* ================= AUTH STATE CHECK ================= */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // If not logged in, block access to index.html
    if (window.location.pathname.includes("index.html")) {
      window.location.href = "login.html";
    }
  }
});
