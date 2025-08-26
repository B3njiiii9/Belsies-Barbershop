// booking.js
import { db } from "./firebase-init.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.querySelector("#booking form");

  if (!bookingForm) return;

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Capture form data
    const fullName = bookingForm.querySelector("input[placeholder='Full Name']").value.trim();
    const email = bookingForm.querySelector("input[placeholder='Email Address']").value.trim();
    const phone = bookingForm.querySelector("input[placeholder='Phone Number']").value.trim();
    const barberName = bookingForm.querySelector("input[placeholder=\"Barber's Name\"]").value.trim();
    const date = bookingForm.querySelector("input[type='date']").value;
    const time = bookingForm.querySelector("input[type='time']").value;
    const service = bookingForm.querySelector("select:nth-of-type(1)").value;
    const slot = bookingForm.querySelector("select:nth-of-type(2)").value;
    const paymentMethod = bookingForm.querySelector("select:nth-of-type(3)").value;

    try {
      // Save booking to Firestore
      await addDoc(collection(db, "bookings"), {
        fullName,
        email,
        phone,
        barberName,
        date,
        time,
        service,
        slot,
        paymentMethod,
        createdAt: serverTimestamp()
      });

      alert("✅ Booking successful! We’ll see you soon.");
      bookingForm.reset();
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("❌ Failed to book. Please try again.");
    }
  });
});

