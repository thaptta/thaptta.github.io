// Scripts/auth.js
import { auth } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🟢 Đăng ký tài khoản
window.signup = function () {
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const message = document.getElementById("signup-message");

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      message.textContent = "✅ Đăng ký thành công! Hãy quay lại để đăng nhập.";
      message.style.color = "green";
    })
    .catch(error => {
      message.textContent = "❌ Lỗi: " + error.message;
      message.style.color = "red";
    });
};

// 🟦 Xử lý nút đăng nhập
const signinButton = document.getElementById('signin-btn');

if (signinButton) {
  signinButton.addEventListener('click', function() {
    const email = document.getElementById("signin-email").value.trim();
    const password = document.getElementById("signin-password").value.trim();
    const message = document.getElementById("signin-message");

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        message.textContent = "✅ Đăng nhập thành công!";
        message.style.color = "green";
        setTimeout(() => window.location.href = "index.html", 1200);
      })
      .catch(error => {
        message.textContent = "❌ Lỗi: " + error.message;
        message.style.color = "red";
      });
  });
}

// 🟡 Tự động nhận biết trạng thái đăng nhập
onAuthStateChanged(auth, user => {
  const info = document.getElementById('user-info');
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

// 🔴 Đăng xuất
window.logout = function() {
  signOut(auth).then(() => {
    window.location.reload();
  });
};
