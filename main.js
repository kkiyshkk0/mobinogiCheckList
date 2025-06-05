// main.js
import { login, logout, initAuthObserver } from './auth.js';
import { setCurrentUser } from './utils/dataHandler.js';
import { renderChecklist } from './ui/renderChecklist.js'

// 로그인/로그아웃 버튼 이벤트 등록
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("logoutBtn").addEventListener("click", logout);

// 전역에서 접근할 수 있도록 체크리스트 컨테이너 정의
const container = document.getElementById('checklist');

let checklistData = null;

// checklist.json 불러오기
fetch('checklist.json')
  .then(res => res.json())
  .then(data => {
    checklistData = data;
  })
  .catch(err => {
    console.error("checklist.json 로딩 실패:", err);
  });

// 로그인 상태 변경 감지 (Firebase Auth)
initAuthObserver(user => {
  setCurrentUser(user); // 사용자 상태 저장
  renderChecklist(container, checklistData); // 로그인 상태 변경 시 렌더링 다시
});