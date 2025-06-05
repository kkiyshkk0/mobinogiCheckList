import { clearChecklistByCategory } from '../reset/clearChecklist.js';
import { removeKeysWithPrefix } from '../utils/storageUtil.js';

export function createButtons(container, data) {
  const dailyBtn = document.createElement('button');
  dailyBtn.textContent = '일일 초기화';
  dailyBtn.className = 'restore-button';
  dailyBtn.onclick = () => {
    clearChecklistByCategory(data, '일일 체크리스트');
    location.reload();
  };

  const weeklyBtn = document.createElement('button');
  weeklyBtn.textContent = '주간 초기화';
  weeklyBtn.className = 'restore-button';
  weeklyBtn.onclick = () => {
    clearChecklistByCategory(data, '주간 체크리스트');
    location.reload();
  };

  const restoreBtn = document.createElement('button');
  restoreBtn.textContent = '숨긴 항목 복원';
  restoreBtn.className = 'restore-button';
  restoreBtn.onclick = () => {
    removeKeysWithPrefix('hide:');
    document.querySelectorAll('.item').forEach(item => {
      item.style.display = 'flex';
    });
  };

  container.appendChild(dailyBtn);
  container.appendChild(weeklyBtn);
  container.appendChild(restoreBtn);
}
