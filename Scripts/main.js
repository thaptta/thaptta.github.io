// Scripts/main.js
import { db } from './firebase.js';
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from './firebase.js';

// 📰 Tải danh sách bài viết
async function loadPosts(category = "") {
  const list = document.getElementById("post-list");
  list.innerHTML = "<p>Đang tải bài viết...</p>";

  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  let count = 0;
  list.innerHTML = "";

  snap.forEach(docSnap => {
    const data = docSnap.data();

    if (category && data.category !== category) return;

    count++;
    const item = document.createElement("div");
    item.className = "post-preview";
    const date = data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : "";
    item.innerHTML = `
      <h3>${data.title}</h3>
      <p class="meta">${data.category || ""} • ${date}</p>
      <p>${(data.content || "").slice(0, 150)}...</p>
      <div class="actions">
        <button class="btn" onclick="viewPost('${docSnap.id}')">Xem chi tiết</button>
      </div>
    `;
    list.appendChild(item);
  });

  if (count === 0) list.innerHTML = "<p>Chưa có bài viết nào.</p>";
}

// 🔍 Tìm kiếm
window.handleSearch = function (e) {
  if (e.key === "Enter") {
    const keyword = document.getElementById("search-box").value.trim().toLowerCase();
    if (keyword) {
      localStorage.setItem("searchKeyword", keyword);
      window.location.href = "search.html";
    }
  }
};

// 🔎 Lọc bài theo danh mục
window.filterByCategory = function() {
  const value = document.getElementById("filter-select").value;
  loadPosts(value);
};

// 🧭 Chuyển tới bài viết chi tiết
window.viewPost = function(id) {
  localStorage.setItem("postId", id);
  window.location.href = "kqtk.html";
};

// 👤 Theo dõi trạng thái đăng nhập để hiện nút đúng
onAuthStateChanged(auth, user => {
  const info = document.getElementById("user-info");
  if (!info) return;

  if (user) {
    info.innerHTML = `
      <span class="user-email">${user.email}</span>
      <button class="btn" id="post-btn" onclick="window.location.href='post.html'">Đăng bài</button>
      <button class="btn ghost" onclick="logout()">Đăng xuất</button>
    `;
  } else {
    info.innerHTML = `
      <button class="btn ghost" onclick="window.location.href='signin.html'">Đăng nhập</button>
      <button class="btn" onclick="window.location.href='signup.html'">Đăng ký</button>
    `;
  }
});

// 🧱 Hàm đăng xuất
window.logout = function() {
  auth.signOut();
  window.location.reload();
};

// 🚀 Gọi hàm khi tải trang
loadPosts();
