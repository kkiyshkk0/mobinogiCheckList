// renderChecklist.js
import { loadData, saveData } from '../utils/dataHandler.js';
import { resetDailyChecklist } from '../reset/resetDaily.js';
import { createChecklist } from './createChecklist.js';
import { createButtons } from './createButtons.js';

// 체크리스트 생성 함수
export async function renderChecklist(container, checklistData) {
  if (!checklistData) return;

  container.innerHTML = ''; // 기존 UI 초기화

  // 일일/주간 초기화 함수는 로그인 여부와 관계없이 항상 실행
  await resetDailyChecklist(checklistData);

  createChecklist(container, checklistData, loadData, saveData);
  createButtons(container, checklistData, loadData, saveData);
}