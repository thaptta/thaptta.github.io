// Scripts/post.js
import { db, auth } from './firebase.js';
import {
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🟢 Hàm đăng bài
window.submitPost = function () {
  const category = document.getElementById("post-category").value.trim();
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();
  const message = document.getElementById("post-message");

  // Kiểm tra nhập đầy đủ
  if (!category || !title || !content) {
    message.textContent = "⚠️ Vui lòng điền đầy đủ thông tin trước khi đăng.";
    message.style.color = "red";
    return;
  }

  // Kiểm tra đã đăng nhập chưa
  const user = auth.currentUser;
  if (!user) {
    message.textContent = "❌ Bạn phải đăng nhập để đăng bài.";
    message.style.color = "red";
    return;
  }

  // Lưu vào Firestore
  addDoc(collection(db, "posts"), {
    category,
    title,
    content,
    author: user.email,
    createdAt: serverTimestamp()
  })
  .then(() => {
    message.textContent = "✅ Đăng bài thành công!";
    message.style.color = "green";
    setTimeout(() => window.location.href = "index.html", 1200);
  })
  .catch(err => {
    message.textContent = "❌ Lỗi: " + err.message;
    message.style.color = "red";
  });
};

// 🔵 Hiển thị thông tin người dùng trên thanh header
onAuthStateChanged(auth, user => {
  const info = document.getElementById("user-info");
  if (!info) return;

  if (user) {
    info.innerHTML = `
      <span class="user-email">${user.email}</span>
      <button class="btn ghost" onclick="logout()">Đăng xuất</button>
    `;
  } else {
    info.innerHTML = `
      <button class="btn ghost" onclick="window.location.href='signin.html'">Đăng nhập</button>
      <button class="btn" onclick="window.location.href='signup.html'">Đăng ký</button>
    `;
  }
});

// 🔴 Đăng xuất
window.logout = function() {
  auth.signOut();
  window.location.href = "index.html";
};
