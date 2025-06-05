// main.js
import { login, logout, initAuthObserver } from './auth.js';
import { setCurrentUser, loadData, saveData } from './utils/dataHandler.js';
import { resetDailyChecklist } from './reset/resetDaily.js';
import { resetWeeklyChecklist } from './reset/resetWeekly.js';
import { createChecklist } from './ui/createChecklist.js';
import { createButtons } from './ui/createButtons.js';

// 로그인/로그아웃 버튼 이벤트 등록
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("logoutBtn").addEventListener("click", logout);

// 전역에서 접근할 수 있도록 체크리스트 컨테이너 정의
const container = document.getElementById('checklist');

let checklistData = null;

// 체크리스트 생성 함수
function renderChecklist() {
  if (!checklistData) return;

  container.innerHTML = ''; // 기존 UI 초기화

  // 일일/주간 초기화 함수는 로그인 여부와 관계없이 항상 실행
  resetDailyChecklist(checklistData);
  resetWeeklyChecklist(checklistData);

  createChecklist(container, checklistData, loadData, saveData);
  createButtons(container, checklistData, loadData, saveData);
}

// checklist.json 불러오기
fetch('checklist.json')
  .then(res => res.json())
  .then(data => {
    checklistData = data;
    renderChecklist(); // 초기 렌더링
  })
  .catch(err => {
    console.error("checklist.json 로딩 실패:", err);
  });

// 로그인 상태 변경 감지 (Firebase Auth)
initAuthObserver(user => {
  setCurrentUser(user); // 사용자 상태 저장
  renderChecklist(); // 로그인 상태 변경 시 렌더링 다시
});