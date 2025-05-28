function getCurrentMinuteString() {
  const now = new Date();
  const pad = (n) => (n < 10 ? '0' + n : n);
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}`;
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

// ✅ 매일 오전 6시에 초기화
function resetDailyChecklist(data) {
  const now = new Date();
  const today = getCurrentDateString();
  const lastReset = localStorage.getItem("lastDailyReset");

  const resetTime = new Date();
  resetTime.setHours(6, 0, 0, 0); // 오전 6시 0분

  console.log("현재 시간:", now.toLocaleString());
  console.log("초기화 시간:", resetTime.toLocaleString());
  console.log("오늘:", today, "/ 마지막 초기화:", lastReset);

  if (now >= resetTime && lastReset !== today) {
    console.log("✅ 일일 체크리스트 초기화 실행");
    clearChecklistByCategory(data, "일일 체크리스트");
    localStorage.setItem("lastDailyReset", today);
  } else {
    console.log("❌ 초기화 조건 불충족: 스킵됨");
  }
}

// ✅ 매주 월요일 오전 6시에 초기화
function resetWeeklyChecklist(data) {
  const now = new Date();
  const weekString = getCurrentWeekString(); // e.g., "2025-W22"
  const lastReset = localStorage.getItem("lastWeeklyReset");

  // 이번 주 월요일 오전 6시로 초기화 기준 시간 설정
  const resetTime = new Date();
  const day = now.getDay(); // 0 (일) ~ 6 (토)
  const diffToMonday = (day + 6) % 7; // 현재 요일에서 월요일까지 지난 일수
  resetTime.setDate(now.getDate() - diffToMonday); // 이번 주 월요일 날짜
  resetTime.setHours(6, 0, 0, 0); // 오전 6시

  // 디버깅 로그 출력
  console.log("현재 시간:", now.toLocaleString());
  console.log("이번 주 기준 월요일 오전 6시:", resetTime.toLocaleString());
  console.log("이번 주 식별자:", weekString, "/ 마지막 초기화:", lastReset);

  if (now >= resetTime && lastReset !== weekString) {
    console.log("✅ 주간 체크리스트 초기화 실행");
    clearChecklistByCategory(data, "주간 체크리스트");
    localStorage.setItem("lastWeeklyReset", weekString);
  } else {
    console.log("❌ 초기화 조건 불충족: 주간 체크리스트 유지됨");
  }
}

fetch('checklist.json')
  .then(res => res.json())
  .then(data => {
    resetDailyChecklist(data);
    resetWeeklyChecklist(data);

    const container = document.getElementById('checklist');

    const restoreButton = document.createElement('button');
    restoreButton.textContent = '숨긴 항목 복원';
    restoreButton.className = 'restore-button';  // 스타일 클래스만 지정

    restoreButton.addEventListener('click', () => {
      // localStorage에서 'hide:'로 시작하는 키들 삭제
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('hide:')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // 모든 숨겨진 itemDiv 다시 표시
      document.querySelectorAll('.item').forEach(item => {
        item.style.display = 'flex';
      });
    });

    data.forEach((superCat, superIdx) => {
      const superCatDiv = document.createElement('div');
      superCatDiv.className = 'super-category';

      const superHeader = document.createElement('h1');
      superHeader.textContent = superCat.superCategory;
      superHeader.style.cursor = 'pointer';
      superHeader.style.userSelect = 'none';

      const categoriesContainer = document.createElement('div');
      categoriesContainer.className = 'categories-container';
      categoriesContainer.style.display = superIdx === 0 ? 'block' : 'none';

      superHeader.addEventListener('click', () => {
        categoriesContainer.style.display = categoriesContainer.style.display === 'none' ? 'block' : 'none';
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

          // superIdx로 배경색 스타일 클래스 추가
          itemDiv.classList.add(superIdx % 2 === 0 ? 'bg-light' : 'bg-dark');

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
          const hideKey = `hide:${superCat.superCategory}:${category.category}:${item.label}`;

          // 초기 숨김 처리
          if (localStorage.getItem(hideKey) === 'true') {
            itemDiv.style.display = 'none';
          }

          // 숨기기 버튼 생성
          const hideBtn = document.createElement('button');
          hideBtn.textContent = 'X';
          hideBtn.style.marginLeft = '8px';
          hideBtn.style.background = 'transparent';
          hideBtn.style.border = 'none';
          hideBtn.style.color = 'red';
          hideBtn.style.cursor = 'pointer';
          hideBtn.title = '숨기기';

          hideBtn.addEventListener('click', () => {
            itemDiv.style.display = 'none';
            localStorage.setItem(hideKey, 'true');
          });

          topRow.appendChild(hideBtn);

          // 체크박스 상태 복원
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

              // 체크박스 상태 복원
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

                if (subCheckbox.checked) subDiv.classList.add('checked');
                else subDiv.classList.remove('checked');

                // 모든 하위 체크박스가 체크되어 있으면 상위 체크박스 체크 및 저장
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

    container.appendChild(restoreButton);
  })
  .catch(err => {
    console.error("checklist.json 로딩 실패:", err);
  });
