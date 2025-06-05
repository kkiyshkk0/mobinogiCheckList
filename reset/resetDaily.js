import { getToday6AM, getMonday6AM } from '../utils/dateUtil.js';
import { clearChecklistByCategory } from './clearChecklist.js';
import { loadData, saveData } from '../utils/dataHandler.js';

export async function resetDailyChecklist(data) {
  const now = new Date();
  const [lastDailyResetRaw, lastWeeklyResetRaw] = await Promise.all([
    loadData('lastDailyReset'),
    loadData('lastWeeklyReset'),
  ]);

  const lastDailyReset = lastDailyResetRaw ? new Date(lastDailyResetRaw) : null;
  const lastWeeklyReset = lastWeeklyResetRaw ? new Date(lastWeeklyResetRaw) : null;

  const dailyResetTime = getToday6AM();
  const weeklyResetTime = getMonday6AM();

  const promises = [];

  if (!lastDailyReset || (lastDailyReset < dailyResetTime && now >= dailyResetTime)) {
    console.log('일간 체크리스트 초기화');
    clearChecklistByCategory(data, '일일 체크리스트');
    promises.push(saveData('lastDailyReset', now.toISOString()));
  }

  if (!lastWeeklyReset || (lastWeeklyReset < weeklyResetTime && now >= weeklyResetTime)) {
    console.log('주간 체크리스트 초기화');
    clearChecklistByCategory(data, '주간 체크리스트');
    promises.push(saveData('lastWeeklyReset', now.toISOString()));
  }

  // 저장 작업도 병렬 처리
  await Promise.all(promises);
}