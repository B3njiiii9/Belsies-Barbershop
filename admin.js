// admin.js
import { db, auth } from "./firebase-init.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ----------- TAB NAVIGATION -----------
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPages = document.querySelectorAll(".tab-page");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove("active"));
    tabPages.forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

// ----------- REALTIME LISTENERS -----------

// BOOKINGS
function listenBookings() {
  const tbody = document.getElementById("bookingsTable");
  const statBookings = document.getElementById("statBookings");
  const statRevenue = document.getElementById("statRevenue");

  const q = query(collection(db, "bookings"), orderBy("date", "desc"));
  onSnapshot(q, snap => {
    let totalRevenue = 0;
    let rows = "";

    snap.forEach(docSnap => {
      const b = docSnap.data();
      const id = docSnap.id;
      const match = b.service?.match(/KSh\s*(\d+)/);
      const amount = match ? Number(match[1]) : 0;
      totalRevenue += amount;

      rows += `
        <tr>
          <td>${b.fullName || "-"}</td>
          <td>${b.service || "-"}</td>
          <td>${b.date || "-"}</td>
          <td>${b.time || "-"}</td>
          <td>${b.barberName || "-"}</td>
          <td>${b.slot || "-"}</td>
          <td>${b.paymentMethod || "-"}</td>
          <td>${b.status || "-"}</td>
          <td>
            <button class="action-btn view" data-id="${id}" data-type="booking">View</button>
            <button class="action-btn reschedule" data-id="${id}" data-type="booking">Reschedule</button>
            <button class="action-btn delete" data-id="${id}" data-type="booking">Delete</button>
          </td>
        </tr>`;
    });

    if (tbody) tbody.innerHTML = rows;
    if (statBookings) statBookings.textContent = snap.size;
    if (statRevenue) statRevenue.textContent = `KSh ${totalRevenue}`;

    addBookingListeners();
  });
}

// MESSAGES
function listenMessages() {
  const tbody = document.getElementById("messagesTable");
  const statMessages = document.getElementById("statMessages");

  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  onSnapshot(q, snap => {
    let rows = "";
    snap.forEach(docSnap => {
      const m = docSnap.data();
      const id = docSnap.id;
      rows += `
        <tr>
          <td>${m.name || "-"}</td>
          <td>${m.email || "-"}</td>
          <td>${m.message || "-"}</td>
          <td>${m.createdAt?.toDate().toLocaleString() || "-"}</td>
          <td>${m.status || "-"}</td>
          <td>
            <button class="action-btn view" data-id="${id}" data-type="message">View</button>
            <button class="action-btn delete" data-id="${id}" data-type="message">Delete</button>
          </td>
        </tr>`;
    });

    if (tbody) tbody.innerHTML = rows;
    if (statMessages) statMessages.textContent = snap.size;

    addMessageListeners();
  });
}

// USERS
function listenUsers() {
  const tbody = document.getElementById("usersTable");
  const statUsers = document.getElementById("statUsers");

  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  onSnapshot(q, snap => {
    let rows = "";
    snap.forEach(docSnap => {
      const u = docSnap.data();
      const id = docSnap.id;
      rows += `
        <tr>
          <td>${u.name || "-"}</td>
          <td>${u.email || "-"}</td>
          <td>${u.role || "-"}</td>
          <td>${u.status || "-"}</td>
          <td>
            <button class="action-btn view" data-id="${id}" data-type="user">View</button>
            <button class="action-btn delete" data-id="${id}" data-type="user">Delete</button>
          </td>
        </tr>`;
    });

    if (tbody) tbody.innerHTML = rows;

    if (statUsers) {
      const userCount = snap.docs.filter(d => d.data().role === "customer").length;
      statUsers.textContent = userCount;
    }

    addUserListeners();
  });
}

// ALLOCATION
function listenAllocation() {
  const allocBookings = document.getElementById("allocBookings");
  const allocEmployees = document.getElementById("allocEmployees");

  onSnapshot(collection(db, "bookings"), snap => {
    if (!allocBookings) return;
    allocBookings.innerHTML = "";
    snap.forEach(docSnap => {
      const b = docSnap.data();
      const id = docSnap.id;
      if (b.status === "Pending") {
        allocBookings.innerHTML += `<li>${b.fullName} — ${b.service} 
          <button class="action-btn delete" data-id="${id}" data-type="booking">Delete</button></li>`;
      }
    });
    addAllocationButtons();
  });

  onSnapshot(collection(db, "users"), snap => {
    if (!allocEmployees) return;
    allocEmployees.innerHTML = "";
    snap.forEach(docSnap => {
      const u = docSnap.data();
      const id = docSnap.id;
      if (u.role === "staff") {
        allocEmployees.innerHTML += `<li>${u.name} (${u.status || "active"})
          <button class="action-btn toggle" data-id="${id}" data-type="staff">Toggle Status</button></li>`;
      }
    });
    addAllocationButtons();
  });
}

// MANAGE STAFF
function listenStaff() {
  const staffDiv = document.getElementById("staffList");
  onSnapshot(collection(db, "users"), snap => {
    if (!staffDiv) return;
    staffDiv.innerHTML = "";
    snap.forEach(docSnap => {
      const u = docSnap.data();
      const id = docSnap.id;
      if (u.role === "staff") {
        staffDiv.innerHTML += `<p>${u.name} (${u.status || "active"})
          <button class="action-btn toggle" data-id="${id}" data-type="staff">Toggle Status</button>
          <button class="action-btn delete" data-id="${id}" data-type="staff">Delete</button>
        </p>`;
      }
    });
    addManageStaffButtons();
  });
}

// REPORTS
function generateReports() {
  const reportsDiv = document.getElementById("reportsSummary");
  if (!reportsDiv) return;

  onSnapshot(collection(db, "bookings"), snap => {
    let totalRevenue = snap.docs.reduce((sum, d) => {
      const s = d.data().service || "";
      const match = s.match(/KSh\s*(\d+)/);
      return sum + (match ? Number(match[1]) : 0);
    }, 0);
    reportsDiv.querySelector(".totalBookings").textContent = snap.size;
    reportsDiv.querySelector(".totalRevenue").textContent = `KSh ${totalRevenue}`;
  });

  onSnapshot(collection(db, "messages"), snap => {
    reportsDiv.querySelector(".totalMessages").textContent = snap.size;
  });

  onSnapshot(collection(db, "users"), snap => {
    const totalCustomers = snap.docs.filter(d => d.data().role === "customer").length;
    reportsDiv.querySelector(".totalCustomers").textContent = totalCustomers;
  });
}

// ----------- BUTTONS -----------

function addBookingListeners() {
  document.querySelectorAll("#bookingsTable .action-btn").forEach(btn => {
    const id = btn.dataset.id;
    btn.addEventListener("click", async () => {
      if (btn.classList.contains("delete") && confirm("Delete this booking?")) {
        await deleteDoc(doc(db, "bookings", id));
      }
      if (btn.classList.contains("reschedule")) {
        const newDate = prompt("Enter new date (YYYY-MM-DD):");
        const newTime = prompt("Enter new time (HH:MM):");
        if (newDate && newTime) await updateDoc(doc(db, "bookings", id), { date: newDate, time: newTime });
      }
      if (btn.classList.contains("view")) alert(`Booking ID: ${id}`);
    });
  });
}

function addMessageListeners() {
  document.querySelectorAll("#messagesTable .action-btn").forEach(btn => {
    const id = btn.dataset.id;
    btn.addEventListener("click", async () => {
      if (btn.classList.contains("delete") && confirm("Delete this message?")) {
        await deleteDoc(doc(db, "messages", id));
      }
      if (btn.classList.contains("view")) alert(`Message ID: ${id}`);
    });
  });
}

function addUserListeners() {
  document.querySelectorAll("#usersTable .action-btn").forEach(btn => {
    const id = btn.dataset.id;
    btn.addEventListener("click", async () => {
      if (btn.classList.contains("delete") && confirm("Delete this user?")) {
        await deleteDoc(doc(db, "users", id));
      }
      if (btn.classList.contains("view")) alert(`User ID: ${id}`);
    });
  });
}

function addAllocationButtons() {
  document.querySelectorAll("#allocBookings .action-btn").forEach(btn => {
    const id = btn.dataset.id;
    btn.addEventListener("click", async () => {
      if (btn.classList.contains("delete") && confirm("Delete this booking?")) {
        await deleteDoc(doc(db, "bookings", id));
      }
    });
  });
  document.querySelectorAll("#allocEmployees .action-btn").forEach(btn => {
    const id = btn.dataset.id;
    btn.addEventListener("click", async () => {
      if (btn.classList.contains("toggle")) {
        const userRef = doc(db, "users", id);
        const userSnap = await userRef.get();
        if (userSnap.exists()) {
          const newStatus = userSnap.data().status === "active" ? "inactive" : "active";
          await updateDoc(userRef, { status: newStatus });
        }
      }
    });
  });
}

function addManageStaffButtons() {
  document.querySelectorAll("#staffList .action-btn").forEach(btn => {
    const id = btn.dataset.id;
    btn.addEventListener("click", async () => {
      const userRef = doc(db, "users", id);
      if (btn.classList.contains("toggle")) {
        const userSnap = await userRef.get();
        if (userSnap.exists()) {
          const newStatus = userSnap.data().status === "active" ? "inactive" : "active";
          await updateDoc(userRef, { status: newStatus });
        }
      }
      if (btn.classList.contains("delete") && confirm("Delete this staff?")) {
        await deleteDoc(userRef);
      }
    });
  });
}

// ----------- LOGOUT -----------
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

// ----------- INIT -----------
listenBookings();
listenMessages();
listenUsers();
listenAllocation();
listenStaff();
generateReports();
