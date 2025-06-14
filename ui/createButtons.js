// createButtons.js
import { clearChecklistByCategory, clearChecklistByHide } from '../reset/clearChecklist.js';
import { saveData } from '../utils/dataHandler.js';
import { renderChecklist } from './renderChecklist.js'

export function createButtons(container, data) {
  // 일일 초기화 버튼
  const dailyBtn = document.createElement('button');
  dailyBtn.textContent = '일일 초기화';
  dailyBtn.className = 'restore-button';
  dailyBtn.onclick = async () => {
    clearChecklistByCategory(data, '일일 체크리스트');
    renderChecklist(container, data);
  };

  // 주간 초기화 버튼
  const weeklyBtn = document.createElement('button');
  weeklyBtn.textContent = '주간 초기화';
  weeklyBtn.className = 'restore-button';
  weeklyBtn.onclick = async () => {
    clearChecklistByCategory(data, '주간 체크리스트');
    renderChecklist(container, data);
  };

  // 숨긴 항목 복원 버튼
  const restoreBtn = document.createElement('button');
  restoreBtn.textContent = '숨긴 항목 복원';
  restoreBtn.className = 'restore-button';
  restoreBtn.onclick = async () => {
    clearChecklistByHide(data);

    // UI 상에서 display 복원
    document.querySelectorAll('.item').forEach(item => {
      item.style.display = 'flex';
    });
  };

  // 버튼들을 컨테이너에 추가
  container.appendChild(dailyBtn);
  container.appendChild(weeklyBtn);
  container.appendChild(restoreBtn);
}
