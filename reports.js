// report.js
import { db } from "./firebase-init.js";
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const reportsDiv = document.getElementById("reports");
  if (!reportsDiv) return;

  // Total Bookings
  onSnapshot(collection(db, "bookings"), (snap) => {
    const totalBookings = snap.size;
    const totalRevenue = snap.docs.reduce((sum, docSnap) => {
      const b = docSnap.data();
      const match = b.service?.match(/KSh\s*(\d+)/);
      return sum + (match ? Number(match[1]) : 0);
    }, 0);

    reportsDiv.innerHTML = `
      <h3>Summary Reports</h3>
      <p>Total Bookings: ${totalBookings}</p>
      <p>Total Revenue: KSh ${totalRevenue}</p>
      <p>Total Messages: 0</p>
      <p>Total Customers: 0</p>
    `;
  });

  // Total Messages
  onSnapshot(collection(db, "messages"), (snap) => {
    const p = reportsDiv.querySelector("p:nth-of-type(3)");
    if (p) p.textContent = `Total Messages: ${snap.size}`;
  });

  // Total Customers
  onSnapshot(collection(db, "users"), (snap) => {
    const customerCount = snap.docs.filter(d => d.data().role === "customer").length;
    const p = reportsDiv.querySelector("p:nth-of-type(4)");
    if (p) p.textContent = `Total Customers: ${customerCount}`;
  });
});
