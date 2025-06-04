import { getToday6AM } from '../utils/dateUtil.js';
import { clearChecklistByCategory } from './clearChecklist.js';

export function resetDailyChecklist(data) {
  const now = new Date();
  const resetTime = getToday6AM();
  const lastResetRaw = localStorage.getItem('lastDailyReset');
  const lastReset = lastResetRaw ? new Date(lastResetRaw) : null;

  if (!lastReset || (lastReset < resetTime && now >= resetTime)) {
    clearChecklistByCategory(data, '일일 체크리스트');
    localStorage.setItem('lastDailyReset', now.toISOString());
  }
}
