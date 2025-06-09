// clearChecklist.js
import { saveData } from '../utils/dataHandler.js';

export function clearChecklistByCategory(data, categoryName) {
  data.forEach(superCat => {
    superCat.categories.forEach(category => {
      if (category.category === categoryName) {
        category.items.forEach(item => {
          const baseKey = `checklist:${superCat.superCategory}:${category.category}:${item.label}`;
          saveData(baseKey, false);
          if (item.subItems) {
            item.subItems.forEach(sub => saveData(`${baseKey}:${sub}`, false));
          }
        });
      }
    });
  });
}

export function clearChecklistByHide(data) {
  data.forEach(superCat => {
    superCat.categories.forEach(category => {
        category.items.forEach(item => {
          const baseKey = `hide:${superCat.superCategory}:${category.category}:${item.label}`;
          saveData(baseKey, false);
          if (item.subItems) {
            item.subItems.forEach(sub => saveData(`${baseKey}:${sub}`, false));
          }
        });
    });
  });
}
