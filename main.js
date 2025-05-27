function getCurrentMinuteString() {
  const now = new Date();
  const pad = (n) => (n < 10 ? '0' + n : n);
  return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}`;
}

function getCurrentDateString() {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getCurrentWeekString() {
  const now = new Date();
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now - firstDayOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber}`;
}

function clearChecklistByCategory(data, categoryName) {
  data.forEach(superCat => {
    superCat.categories.forEach(category => {
      if (category.category === categoryName) {
        category.items.forEach(item => {
          const baseKey = `checklist:${superCat.superCategory}:${category.category}:${item.label}`;
          localStorage.setItem(baseKey, 'false');
          if (item.subItems) {
            item.subItems.forEach(sub => {
              localStorage.setItem(`${baseKey}:${sub}`, 'false');
            });
          }
        });
      }
    });
  });
}

fetch('checklist.json')
  .then(res => res.json())
  .then(data => {
    // 초기화 체크
    const nowMinute = getCurrentMinuteString();
    const today = getCurrentDateString();
    const thisWeek = getCurrentWeekString();

    const savedDailyReset = localStorage.getItem('dailyResetTime');
    // 1분 테스트
    // if (savedDailyReset !== nowMinute) {
    //   clearChecklistByCategory(data, '일일 체크리스트');
    //   localStorage.setItem('dailyResetTime', nowMinute);
    // }
    if (savedDailyReset !== today) {
      clearChecklistByCategory(data, '일일 체크리스트');
      localStorage.setItem('dailyResetTime', today);
    }

    const savedWeeklyReset = localStorage.getItem('weeklyResetTime');
    if (savedWeeklyReset !== thisWeek && (new Date()).getDay() === 1) { // 월요일 체크
      clearChecklistByCategory(data, '주간 체크리스트');
      localStorage.setItem('weeklyResetTime', thisWeek);
    }

    const container = document.getElementById('checklist');

    data.forEach((superCat, superIdx) => {
      const superCatDiv = document.createElement('div');
      superCatDiv.className = 'super-category';

      const superHeader = document.createElement('h1');
      superHeader.textContent = superCat.superCategory;
      superHeader.style.cursor = 'pointer';
      superHeader.style.userSelect = 'none';

      const categoriesContainer = document.createElement('div');
      categoriesContainer.className = 'categories-container';

      if (superIdx !== 0) {
        categoriesContainer.style.display = 'none';
      }

      superHeader.addEventListener('click', () => {
        const isHidden = categoriesContainer.style.display === 'none';
        categoriesContainer.style.display = isHidden ? 'block' : 'none';
      });

      superCatDiv.appendChild(superHeader);

      superCat.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';

        const header = document.createElement('h2');
        header.textContent = category.category;
        header.style.userSelect = 'none';
        categoryDiv.appendChild(header);

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'items-container';

        category.items.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'item';
          itemDiv.style.flexDirection = 'column';

          const topRow = document.createElement('div');
          topRow.style.display = 'flex';
          topRow.style.alignItems = 'center';
          topRow.style.width = '100%';

          const label = document.createElement('label');
          label.style.flex = '1';
          label.style.display = 'flex';
          label.style.alignItems = 'center';

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';

          // 고유 키 생성
          const itemKey = `checklist:${superCat.superCategory}:${category.category}:${item.label}`;

          // 상태 복원
          const saved = localStorage.getItem(itemKey);
          if (saved === 'true') {
            checkbox.checked = true;
            itemDiv.classList.add('checked');
          }

          label.appendChild(checkbox);
          label.append(item.label);
          topRow.appendChild(label);

          if (item.subItems) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-btn';
            toggleBtn.style.border = 'none';
            toggleBtn.style.background = 'transparent';
            toggleBtn.style.cursor = 'pointer';

            const icon = document.createElement('img');
            icon.src = 'icons/arrow-up.svg';
            icon.alt = '접기/펼치기';
            icon.style.width = '16px';
            icon.style.height = '16px';

            toggleBtn.appendChild(icon);
            topRow.appendChild(toggleBtn);
          }

          itemDiv.appendChild(topRow);

          if (item.subItems) {
            const subList = document.createElement('div');
            subList.className = 'sub-items';
            subList.style.display = 'flex';
            subList.style.marginLeft = '1.5rem';
            subList.style.marginTop = '0.5rem';
            subList.style.flexWrap = 'wrap';
            subList.style.gap = '0.3rem';

            item.subItems.forEach(sub => {
              const subDiv = document.createElement('div');
              subDiv.className = 'sub-item';

              const subLabel = document.createElement('label');
              const subCheckbox = document.createElement('input');
              subCheckbox.type = 'checkbox';

              const subKey = `${itemKey}:${sub}`;

              // 상태 복원
              const subSaved = localStorage.getItem(subKey);
              if (subSaved === 'true') {
                subCheckbox.checked = true;
                subDiv.classList.add('checked');
              }

              subLabel.appendChild(subCheckbox);
              subLabel.append(sub);
              subDiv.appendChild(subLabel);

              subCheckbox.addEventListener('change', () => {
                // 상태 저장
                localStorage.setItem(subKey, subCheckbox.checked);

                if (subCheckbox.checked) {
                  subDiv.classList.add('checked');
                } else {
                  subDiv.classList.remove('checked');
                }

                const subCheckboxes = itemDiv.querySelectorAll('.sub-item input[type="checkbox"]');
                const allChecked = Array.from(subCheckboxes).every(cb => cb.checked);
                checkbox.checked = allChecked;
                itemDiv.classList.toggle('checked', allChecked);

                localStorage.setItem(itemKey, allChecked);
              });

              subList.appendChild(subDiv);
            });

            checkbox.addEventListener('change', () => {
              localStorage.setItem(itemKey, checkbox.checked);
              itemDiv.classList.toggle('checked', checkbox.checked);

              const subCheckboxes = subList.querySelectorAll('input[type="checkbox"]');
              const subItems = subList.querySelectorAll('.sub-item');
              subCheckboxes.forEach((subCheckbox, idx) => {
                subCheckbox.checked = checkbox.checked;
                localStorage.setItem(`${itemKey}:${item.subItems[idx]}`, checkbox.checked);
                if (checkbox.checked) {
                  subItems[idx].classList.add('checked');
                } else {
                  subItems[idx].classList.remove('checked');
                }
              });
            });

            const toggleBtn = topRow.querySelector('.toggle-btn');
            if (toggleBtn) {
              const icon = toggleBtn.querySelector('img');
              toggleBtn.addEventListener('click', () => {
                const isHidden = subList.style.display === 'none';
                subList.style.display = isHidden ? 'flex' : 'none';
                icon.src = isHidden ? 'icons/arrow-up.svg' : 'icons/arrow-down.svg';
              });
            }

            itemDiv.appendChild(subList);
          } else {
            checkbox.addEventListener('change', () => {
              itemDiv.classList.toggle('checked', checkbox.checked);
              localStorage.setItem(itemKey, checkbox.checked);
            });
          }

          itemsContainer.appendChild(itemDiv);
        });

        categoryDiv.appendChild(itemsContainer);
        categoriesContainer.appendChild(categoryDiv);
      });

      superCatDiv.appendChild(categoriesContainer);
      container.appendChild(superCatDiv);
    });
  });
