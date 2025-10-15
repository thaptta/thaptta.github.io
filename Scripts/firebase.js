import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnxzJHGqqf_dhoOfZ4NaQ6W4SwNXyB-f8",
  authDomain: "thaptta.firebaseapp.com",
  projectId: "thaptta",
  storageBucket: "thaptta.firebasestorage.app",
  messagingSenderId: "1080889110589",
  appId: "1:1080889110589:web:e5963989bbbf2ec1967a54"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };