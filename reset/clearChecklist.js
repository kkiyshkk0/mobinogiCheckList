import { setBoolean } from '../utils/storageUtil.js';

export function clearChecklistByCategory(data, categoryName) {
  data.forEach(superCat => {
    superCat.categories.forEach(category => {
      if (category.category === categoryName) {
        category.items.forEach(item => {
          const baseKey = `checklist:${superCat.superCategory}:${category.category}:${item.label}`;
          setBoolean(baseKey, false);
          if (item.subItems) {
            item.subItems.forEach(sub => setBoolean(`${baseKey}:${sub}`, false));
          }
        });
      }
    });
  });
}
