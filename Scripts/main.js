// Scripts/main.js
import { db, auth } from './firebase.js';
import { collection, query, orderBy, getDocs, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const postsContainer = document.getElementById("posts-container");
const announcementList = document.getElementById("announcement-list");

// ==================== HIỂN THỊ THÔNG TIN NGƯỜI DÙNG ====================
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
  <button class="btn ghost" onclick="window.location.href='./signin.html'">Đăng nhập</button>
  <button class="btn" onclick="window.location.href='./signup.html'">Đăng ký</button>
`;

  }
});

window.logout = function () {
  auth.signOut();
  window.location.reload();
};

// ==================== HÀM TẢI DANH SÁCH BÀI VIẾT ====================
async function loadPosts(filterCategory = "") {
  postsContainer.innerHTML = "<p>⏳ Đang tải bài viết...</p>";

  try {
    let q;
    if (filterCategory) {
      q = query(collection(db, "posts"), where("category", "==", filterCategory), orderBy("createdAt", "desc"));
    } else {
      q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    }

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      postsContainer.innerHTML = "<p>😔 Chưa có bài viết nào.</p>";
      return;
    }

    postsContainer.innerHTML = "";
    announcementList.innerHTML = "";

    snapshot.forEach(doc => {
      const post = doc.data();
      const date = post.createdAt?.toDate().toLocaleString("vi-VN") || "Chưa rõ";

      // 🖼️ Tạo phần hình ảnh (nhiều ảnh)
      let imagesHTML = "";
      if (post.images && Array.isArray(post.images)) {
        imagesHTML = post.images.map(url => `
          <img src="${url}" alt="Ảnh bài viết" class="post-img" loading="lazy">
        `).join("");
      } else if (post.imageUrl) {
        imagesHTML = `<img src="${post.imageUrl}" alt="Ảnh bài viết" class="post-img" loading="lazy">`;
      }

      // 🧾 HTML cho mỗi bài viết
      const postHTML = `
        <div class="post">
          <div class="post-images">${imagesHTML}</div>
          <div class="post-text">
            <h3><a href="post-detail.html?id=${doc.id}">${post.title}</a></h3>
            <p><strong>📅</strong> ${date}</p>
            <p>${post.content}</p>
            ${post.fileUrl ? `<p><a href="${post.fileUrl}" target="_blank" class="download">📎 Tải tệp đính kèm</a></p>` : ""}
            <p class="author">👤 Đăng bởi: ${post.author}</p>
          </div>
        </div>
      `;

      postsContainer.innerHTML += postHTML;

      // Nếu là thông báo thì thêm vào danh sách bên phải
      if (post.category === "Thông báo") {
        announcementList.innerHTML += `<li><a href="#">${post.title}</a></li>`;
      }
    });

    // Gắn sự kiện phóng to ảnh
    setupImageModal();

  } catch (err) {
    postsContainer.innerHTML = `<p style="color:red">❌ Lỗi tải dữ liệu: ${err.message}</p>`;
  }
}

// ==================== HÀM PHÓNG TO ẢNH ====================
function setupImageModal() {
  // Xóa modal cũ nếu có
  const oldModal = document.getElementById("imageModal");
  if (oldModal) oldModal.remove();

  // Tạo modal hiển thị ảnh
  const modal = document.createElement("div");
  modal.id = "imageModal";
  modal.className = "image-modal";
  modal.innerHTML = `<img id="modalImage" src="">`;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector("img");

  // Khi click vào ảnh bài viết -> mở modal
  document.querySelectorAll(".post-img").forEach(img => {
    img.addEventListener("click", () => {
      modal.style.display = "flex";
      modalImg.src = img.src;
    });
  });

  // Khi click ra ngoài ảnh -> đóng modal
  modal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// ==================== KHỞI CHẠY ====================
loadPosts();

// ==================== LỌC THEO DANH MỤC ====================
document.querySelectorAll("[data-category]").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const cat = e.target.getAttribute("data-category");
    loadPosts(cat);
  });
});
