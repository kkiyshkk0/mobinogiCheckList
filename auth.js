// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js"; // ✅ Realtime Database

// ✅ Realtime Database URL 꼭 포함
const firebaseConfig = {
  apiKey: "AIzaSyAc1NPilBwG_6dULN2QOw3rsPaoO_tlQcA",
  authDomain: "mobinogichecklist.firebaseapp.com",
  databaseURL: "https://mobinogichecklist-default-rtdb.firebaseio.com",
  projectId: "mobinogichecklist",
  storageBucket: "mobinogichecklist.appspot.com",
  messagingSenderId: "619587399253",
  appId: "1:619587399253:web:19dad65215050565e76edc"
};

// ✅ Firebase 초기화
const app = initializeApp(firebaseConfig);

// ✅ 인증 및 DB 인스턴스
const auth = getAuth(app);
const rtdb = getDatabase(app);

// ✅ 구글 로그인 제공자
const provider = new GoogleAuthProvider();

// ✅ 로그인 함수
export function login() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // 로그인한 사용자 정보 저장 예시
      const user = result.user;
      set(ref(rtdb, `users/${user.uid}`), {
        name: user.displayName,
        email: user.email,
        lastLogin: Date.now()
      });
      return user.getIdToken();
    })
    .catch(console.error);
}

// ✅ 로그아웃 함수
export function logout() {
  signOut(auth).catch(console.error);
}

// ✅ 인증 상태 감지
export function initAuthObserver(callback) {
  onAuthStateChanged(auth, (user) => {
    document.getElementById('loginBtn').style.display = user ? 'none' : 'inline-block';
    document.getElementById('logoutBtn').style.display = user ? 'inline-block' : 'none';
    if (typeof callback === 'function') callback(user);
  });
}

// ✅ realtime database에서 사용할 수 있도록 export
export { rtdb, ref, get, update };