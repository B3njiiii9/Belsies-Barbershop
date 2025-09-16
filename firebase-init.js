// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5Cdk2XFfd6TZTyQWj9MyL5bPoXg_WnAs",
  authDomain: "belsies-barbershop-e9c12.firebaseapp.com",
  projectId: "belsies-barbershop-e9c12",
  storageBucket: "belsies-barbershop-e9c12.firebasestorage.app",
  messagingSenderId: "616466445725",
  appId: "1:616466445725:web:038eb4a9d25ff0efe62b74",
  measurementId: "G-5G17LKBEH5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

