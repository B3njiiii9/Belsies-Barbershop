// users.js
import { db } from "./firebase-init.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const addUserForm = document.getElementById("addUserForm");
  if (!addUserForm) return;

  addUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = addUserForm.name.value.trim();
    const email = addUserForm.email.value.trim();
    const role = addUserForm.role.value;
    const status = addUserForm.status.value;

    if (!name || !email) return;

    try {
      await addDoc(collection(db, "users"), {
        name,
        email,
        role,
        status,
        createdAt: serverTimestamp()
      });

      alert("✅ User added successfully!");
      addUserForm.reset();
    } catch (err) {
      console.error("Error adding user:", err);
      alert("❌ Failed to add user. Please try again.");
    }
  });
});
