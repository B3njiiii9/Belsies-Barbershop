// booking.js
import { db } from "./firebase-init.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.querySelector("#booking form");
  if (!bookingForm) return;

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get values using name attributes
    const fullName = bookingForm.fullName.value.trim();
    const email = bookingForm.email.value.trim();
    const phone = bookingForm.phone.value.trim();
    const barberName = bookingForm.barberName.value.trim();
    const date = bookingForm.date.value;
    const time = bookingForm.time.value;
    const service = bookingForm.service.value;
    const slot = bookingForm.slot.value;
    const paymentMethod = bookingForm.paymentMethod.value;

    try {
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
