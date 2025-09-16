// contact.js
import { db } from "./firebase-init.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector("#contact form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        createdAt: serverTimestamp()
      });

      alert("✅ Message sent successfully! We’ll get back to you soon.");
      contactForm.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("❌ Failed to send message. Please try again.");
    }
  });
});
