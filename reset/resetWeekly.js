import { getMonday6AM } from '../utils/dateUtil.js';
import { clearChecklistByCategory } from './clearChecklist.js';

export function resetWeeklyChecklist(data) {
  const now = new Date();
  const resetTime = getMonday6AM();
  const lastResetRaw = localStorage.getItem('lastWeeklyReset');
  const lastReset = lastResetRaw ? new Date(lastResetRaw) : null;

  if (!lastReset || (lastReset < resetTime && now >= resetTime)) {
    clearChecklistByCategory(data, '주간 체크리스트');
    localStorage.setItem('lastWeeklyReset', now.toISOString());
  }
}
