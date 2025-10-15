// Scripts/post.js
import { db, auth, storage } from './firebase.js';
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const allowedEmails = [
  "nhtho.thcttpl@sobaclieu.edu.vn",
  "nguyenhuuthoplbl@gmail.com",
  "ngngaplbl@gmail.com"
];

let currentUser = null;

// 🧾 Kiểm tra đăng nhập & quyền
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

window.submitPost = async function () {
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();
  const category = document.getElementById("post-category").value.trim();
  const msg = document.getElementById("post-message");

  const imageFile = document.getElementById("post-image").files[0];
  const attachFile = document.getElementById("post-file").files[0];

  if (!title || !content || !category) {
    msg.textContent = "⚠️ Vui lòng nhập đầy đủ thông tin.";
    msg.style.color = "red";
    return;
  }

  msg.textContent = "⏳ Đang đăng bài...";
  msg.style.color = "gray";

  try {
    let imageUrl = "";
    let fileUrl = "";

    // 🖼️ Nếu có ảnh thì tải lên Storage
    if (imageFile) {
      const imageRef = ref(storage, `postImages/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    // 📎 Nếu có tệp đính kèm thì tải lên Storage
    if (attachFile) {
      const fileRef = ref(storage, `postFiles/${Date.now()}_${attachFile.name}`);
      await uploadBytes(fileRef, attachFile);
      fileUrl = await getDownloadURL(fileRef);
    }

    // 🗂️ Lưu vào Firestore
    await addDoc(collection(db, "posts"), {
      title,
      content,
      category,
      author: currentUser.email,
      imageUrl,
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
