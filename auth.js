import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAc1NPilBwG_6dULN2QOw3rsPaoO_tlQcA",
  authDomain: "mobinogichecklist.firebaseapp.com",
  projectId: "mobinogichecklist",
  storageBucket: "mobinogichecklist.firebasestorage.app",
  messagingSenderId: "619587399253",
  appId: "1:619587399253:web:19dad65215050565e76edc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export function login() {
  signInWithPopup(auth, provider).catch(console.error);
}

export function logout() {
  signOut(auth).catch(console.error);
}

export function initAuthObserver(callback) {
  onAuthStateChanged(auth, (user) => {
    document.getElementById('loginBtn').style.display = user ? 'none' : 'inline-block';
    document.getElementById('logoutBtn').style.display = user ? 'inline-block' : 'none';
    if (typeof callback === 'function') callback(user);
  });
}

export { db };
