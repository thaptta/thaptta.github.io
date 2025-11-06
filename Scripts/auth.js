// Scripts/auth.js
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🟢 Đăng ký tài khoản
window.signup = async function() {
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const msg = document.getElementById("signup-message");

  if (!email || !password) {
    msg.textContent = "⚠️ Vui lòng nhập đầy đủ thông tin!";
    msg.style.color = "orange";
    return;
  }

  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) {
      msg.textContent = "❌ Email này đã được đăng ký trước đó!";
      msg.style.color = "red";
      return;
    }

    await createUserWithEmailAndPassword(auth, email, password);
    msg.textContent = "✅ Đăng ký thành công! Hãy đăng nhập.";
    msg.style.color = "green";
    setTimeout(() => (window.location.href = "signin.html"), 1500);
  } catch (err) {
  if (err.code === "auth/email-already-in-use") {
    msg.textContent = "❌ Email này đã được đăng ký trước đó!";
  } else {
    msg.textContent = "❌ " + err.message;
  }
  msg.style.color = "red";
}
};

// 🔵 Đăng nhập
window.signin = async function() {
  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("signin-password").value.trim();
  const msg = document.getElementById("signin-message");
  const remember = document.getElementById("remember-me");

  if (!email || !password) {
    msg.textContent = "⚠️ Nhập đầy đủ email và mật khẩu!";
    msg.style.color = "orange";
    return;
  }

  try {
    await setPersistence(auth, remember.checked ? browserLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    msg.textContent = "✅ Đăng nhập thành công!";
    msg.style.color = "green";
    setTimeout(() => (window.location.href = "index.html"), 1200);
  } catch (err) {
    if (err.code === "auth/user-not-found") msg.textContent = "❌ Tài khoản chưa được đăng ký!";
    else if (err.code === "auth/wrong-password") msg.textContent = "❌ Sai mật khẩu!";
    else msg.textContent = "❌ " + err.message;
    msg.style.color = "red";
  }
};

// 🟣 Quên mật khẩu
window.resetPassword = async function() {
  const email = document.getElementById("reset-email").value.trim();
  const msg = document.getElementById("reset-message");

  if (!email) {
    msg.textContent = "⚠️ Nhập email để đặt lại mật khẩu!";
    msg.style.color = "orange";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    msg.textContent = "📨 Đã gửi email đặt lại mật khẩu! Hãy kiểm tra hộp thư.";
    msg.style.color = "green";
    document.getElementById("reset-guide").style.display = "block";
  } catch (err) {
    msg.textContent = "❌ " + err.message;
    msg.style.color = "red";
  }
};

// 🔴 Đăng xuất
window.logout = function() {
  signOut(auth).then(() => (window.location.href = "signin.html"));
};
