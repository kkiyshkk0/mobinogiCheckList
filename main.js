import { resetDailyChecklist } from './reset/resetDaily.js'
import { resetWeeklyChecklist } from './reset/resetWeekly.js'
import { createChecklist } from './ui/createChecklist.js';
import { createButtons } from './ui/createButtons.js'

fetch('checklist.json')
  .then(res => res.json())
  .then(data => {
    resetDailyChecklist(data);
    resetWeeklyChecklist(data);

    const container = document.getElementById('checklist');

    createChecklist(container, data);
    createButtons(container, data);
  })
  .catch(err => {
    console.error("checklist.json 로딩 실패:", err);
  });
