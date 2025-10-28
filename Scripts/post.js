import { db, auth } from './firebase.js';
import {
  collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const allowedEmails = [
  "nhtho.thcttpl@sobaclieu.edu.vn",
  "nguyenhuuthoplbl@gmail.com",
  "ngngaplbl@gmail.com"
];

let currentUser = null;

onAuthStateChanged(auth, user => {
  if (!user) {
    alert("⚠️ Bạn cần đăng nhập để đăng bài.");
    window.location.href = "signin.html";
  } else if (!allowedEmails.includes(user.email)) {
    alert("❌ Tài khoản của bạn không có quyền đăng bài.");
    window.location.href = "index.html";
  } else {
    currentUser = user;
  }
});

async function uploadImageToImgbb(file) {
  const apiKey = "2c029887fa5071fb59b4d79f44f96a7f"; 
  const formData = new FormData();
  formData.append("image", file);
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData
  });
  const result = await response.json();
  if (!result.success) throw new Error("Không thể tải lên Imgbb");
  return result.data.url;
}

window.submitPost = async function () {
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();
  const category = document.getElementById("post-category").value.trim();
  const msg = document.getElementById("post-message");

  const imageFiles = document.getElementById("post-image").files; // nhiều ảnh
  const attachFile = document.getElementById("post-file").files[0];

  if (!title || !content || !category) {
    msg.textContent = "⚠️ Vui lòng nhập đầy đủ thông tin.";
    msg.style.color = "red";
    return;
  }

  msg.textContent = "⏳ Đang đăng bài...";
  msg.style.color = "gray";

  try {
    const imageUrls = [];

    for (const file of imageFiles) {
      const url = await uploadImageToImgbb(file);
      imageUrls.push(url);
    }

    let fileUrl = "";
    if (attachFile) {
      fileUrl = await uploadImageToImgbb(attachFile);
    }

    await addDoc(collection(db, "posts"), {
      title,
      content,
      category,
      author: currentUser.email,
      images: imageUrls, // lưu mảng ảnh thay vì 1 ảnh
      fileUrl,
      createdAt: serverTimestamp()
    });

    msg.textContent = "✅ Đăng bài thành công!";
    msg.style.color = "green";
    setTimeout(() => window.location.href = "index.html", 1200);

  } catch (error) {
    msg.textContent = "❌ Lỗi: " + error.message;
    msg.style.color = "red";
  }
};

  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");

  document.querySelectorAll(".post-img").forEach(img => {
    img.addEventListener("click", () => {
      modal.style.display = "flex";
      modalImg.src = img.src;
    });
  });

  modal.addEventListener("click", () => {
    modal.style.display = "none";
  });
