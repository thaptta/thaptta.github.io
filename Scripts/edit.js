// Scripts/edit.js
import { db, auth } from './firebase.js';
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const id = localStorage.getItem("editPostId");

// 🟢 Tải dữ liệu bài viết cần sửa
async function loadPostForEdit() {
  if (!id) {
    alert("Không có bài viết nào được chọn để chỉnh sửa.");
    window.location.href = "index.html";
    return;
  }

  const ref = doc(db, "posts", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    alert("Bài viết không tồn tại hoặc đã bị xóa.");
    window.location.href = "index.html";
    return;
  }

  const data = snap.data();
  document.getElementById("post-title").value = data.title;
  document.getElementById("post-content").value = data.content;
  document.getElementById("post-category").value = data.category;
}

// 🟣 Cập nhật bài viết
window.updatePost = async function () {
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();
  const category = document.getElementById("post-category").value.trim();
  const msg = document.getElementById("edit-message");

  if (!title || !content || !category) {
    msg.textContent = "⚠️ Vui lòng điền đủ thông tin.";
    msg.style.color = "red";
    return;
  }

  try {
    await updateDoc(doc(db, "posts", id), {
      title,
      content,
      category,
      updatedAt: serverTimestamp()
    });
    msg.textContent = "✅ Cập nhật bài viết thành công!";
    msg.style.color = "green";
    setTimeout(() => window.location.href = "index.html", 1200);
  } catch (err) {
    msg.textContent = "❌ Lỗi: " + err.message;
    msg.style.color = "red";
  }
};

// 🧑‍🏫 Chỉ cho phép tác giả bài viết được chỉnh sửa
onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Bạn cần đăng nhập để chỉnh sửa bài viết.");
    window.location.href = "signin.html";
  } else {
    loadPostForEdit();
  }
});
