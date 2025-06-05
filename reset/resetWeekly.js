import { getMonday6AM } from '../utils/dateUtil.js';
import { getValue, setValue } from '../utils/storageUtil.js';
import { clearChecklistByCategory } from './clearChecklist.js';

export function resetWeeklyChecklist(data) {
  const now = new Date();
  const resetTime = getMonday6AM();
  const lastResetRaw = getValue('lastWeeklyReset');
  const lastReset = lastResetRaw ? new Date(lastResetRaw) : null;

  if (!lastReset || (lastReset < resetTime && now >= resetTime)) {
    clearChecklistByCategory(data, '주간 체크리스트');
    setValue('lastWeeklyReset', now.toISOString());
  }
}
