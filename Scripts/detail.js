// Scripts/detail.js
import { db, auth } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Lấy ID bài viết từ localStorage
const postId = localStorage.getItem("postId");
const titleEl = document.getElementById("post-title");
const metaEl = document.getElementById("post-meta");
const contentEl = document.getElementById("post-content");
const imageEl = document.getElementById("post-image");
const fileEl = document.getElementById("post-file");

// 🟢 Hiển thị thông tin người dùng
onAuthStateChanged(auth, user => {
  const info = document.getElementById("user-info");
  if (!info) return;

  if (user) {
    info.innerHTML = `
      <span>${user.email}</span>
      <button class="btn ghost" onclick="logout()">Đăng xuất</button>
    `;
  } else {
    info.innerHTML = `
      <button class="btn ghost" onclick="window.location.href='signin.html'">Đăng nhập</button>
      <button class="btn" onclick="window.location.href='signup.html'">Đăng ký</button>
    `;
  }
});

window.logout = function () {
  auth.signOut();
  window.location.href = "index.html";
};

// 📰 Hàm tải dữ liệu bài viết
async function loadPostDetail() {
  if (!postId) {
    titleEl.textContent = "❌ Không tìm thấy bài viết.";
    return;
  }

  try {
    const ref = doc(db, "posts", postId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      titleEl.textContent = "❌ Bài viết không tồn tại.";
      return;
    }

    const post = snap.data();
    const date = post.createdAt?.toDate().toLocaleString("vi-VN") || "Chưa rõ";

    titleEl.textContent = post.title;
    metaEl.textContent = `${post.category || ""} • ${date} • 👤 ${post.author || "Không rõ"}`;
    contentEl.innerHTML = `<div style="white-space: pre-wrap;">${post.content}</div>`;

    // 🖼️ Ảnh minh họa
    if (post.imageUrl) {
      imageEl.src = post.imageUrl;
      imageEl.style.display = "block";
    }

    // 📎 File đính kèm
    if (post.fileUrl) {
      fileEl.innerHTML = `<a href="${post.fileUrl}" target="_blank" class="download">📎 Tải tệp đính kèm</a>`;
    }

  } catch (err) {
    titleEl.textContent = "❌ Lỗi tải dữ liệu: " + err.message;
  }
}

loadPostDetail();
