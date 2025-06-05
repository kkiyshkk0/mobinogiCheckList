// createChecklist.js
import { loadData, saveData } from '../utils/dataHandler.js';

// 체크리스트를 생성하는 함수
export function createChecklist(container, data) {
  data.forEach((superCat, superIdx) => {
    // 상위 카테고리(div) 생성
    const superCatDiv = document.createElement('div');
    superCatDiv.className = 'super-category';

    // 상위 카테고리 제목(h1) 생성
    const superHeader = document.createElement('h1');
    superHeader.textContent = superCat.superCategory;
    superHeader.classList.add('super-header');

    // 하위 카테고리를 담을 컨테이너
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'categories-container';

    // 스토리지를 통해 이 상위 카테고리의 접힘 상태를 확인
    const collapseKey = `collapseState:${superCat.superCategory}`;
    loadData(collapseKey).then(value => {
      const isCollapsed = value === true;
      categoriesContainer.style.display = isCollapsed ? 'none' : 'block';
    });

    // 상위 카테고리 제목 클릭 시 접기/펼치기 기능
    superHeader.addEventListener('click', async () => {
      const currentlyHidden = categoriesContainer.style.display === 'none';
      categoriesContainer.style.display = currentlyHidden ? 'block' : 'none';
      await saveData(collapseKey, !currentlyHidden);
    });

    superCatDiv.appendChild(superHeader);

    // 하위 카테고리 반복
    superCat.categories.forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'category';

      const header = document.createElement('h2');
      header.textContent = category.category;
      categoryDiv.appendChild(header);

      const itemsContainer = document.createElement('div');
      itemsContainer.className = 'items-container';

      // 항목 반복
      category.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.classList.add(superIdx % 2 === 0 ? 'bg-light' : 'bg-dark'); // 배경색 교차

        const topRow = document.createElement('div');
        topRow.className = 'item-top-row';

        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const itemKey = `checklist:${superCat.superCategory}:${category.category}:${item.label}`;
        const hideKey = `hide:${superCat.superCategory}:${category.category}:${item.label}`;

        // 숨김 처리된 항목은 보이지 않게 함
        loadData(hideKey).then(hidden => {
          if (hidden === true) {
            itemDiv.style.display = 'none';
          }
        });

        // 항목 숨기기 버튼 (X)
        const hideBtn = document.createElement('button');
        hideBtn.textContent = 'X';
        hideBtn.className = 'hide-btn';
        hideBtn.title = '숨기기';

        hideBtn.addEventListener('click', async () => {
          itemDiv.style.display = 'none';
          await saveData(hideKey, true);
        });

        topRow.appendChild(hideBtn);

        // 기존 저장 상태 반영
        loadData(itemKey).then(saved => {
          if (saved === true) {
            checkbox.checked = true;
            itemDiv.classList.add('checked');
          }
        });

        label.appendChild(checkbox);
        label.append(item.label);
        topRow.appendChild(label);

        // 서브 항목이 존재하면 토글 버튼 추가
        if (item.subItems) {
          const toggleBtn = document.createElement('button');
          toggleBtn.className = 'toggle-btn';

          const icon = document.createElement('img');
          icon.src = 'icons/arrow-up.svg';
          icon.alt = '접기/펼치기';

          toggleBtn.appendChild(icon);
          topRow.appendChild(toggleBtn);
        }

        itemDiv.appendChild(topRow);

        // 서브 항목 처리
        if (item.subItems) {
          const subList = document.createElement('div');
          subList.className = 'sub-items';

          item.subItems.forEach(sub => {
            const subDiv = document.createElement('div');
            subDiv.className = 'sub-item';

            const subLabel = document.createElement('label');
            const subCheckbox = document.createElement('input');
            subCheckbox.type = 'checkbox';

            const subKey = `${itemKey}:${sub}`;
            loadData(subKey).then(subSaved => {
              if (subSaved === true) {
                subCheckbox.checked = true;
                subDiv.classList.add('checked');
              }
            });

            subLabel.appendChild(subCheckbox);
            subLabel.append(sub);
            subDiv.appendChild(subLabel);

            // 서브 체크박스 클릭 시 상태 저장 및 스타일 갱신
            subCheckbox.addEventListener('change', async () => {
              await saveData(subKey, subCheckbox.checked);
              subDiv.classList.toggle('checked', subCheckbox.checked);

              // 모든 서브 항목이 체크됐는지 확인 후 상위 체크박스 상태 반영
              const subCheckboxes = itemDiv.querySelectorAll('.sub-item input[type="checkbox"]');
              const allChecked = Array.from(subCheckboxes).every(cb => cb.checked);
              checkbox.checked = allChecked;
              itemDiv.classList.toggle('checked', allChecked);
              await saveData(itemKey, allChecked);
            });

            subList.appendChild(subDiv);
          });

          // 상위 항목 체크박스 클릭 시 모든 서브 항목 일괄 체크/해제
          checkbox.addEventListener('change', async () => {
            itemDiv.classList.toggle('checked', checkbox.checked);
            await saveData(itemKey, checkbox.checked);

            const subCheckboxes = subList.querySelectorAll('input[type="checkbox"]');
            const subItems = subList.querySelectorAll('.sub-item');
            subCheckboxes.forEach(async (subCheckbox, idx) => {
              subCheckbox.checked = checkbox.checked;
              subItems[idx].classList.toggle('checked', checkbox.checked);
              await saveData(`${itemKey}:${item.subItems[idx]}`, checkbox.checked);
            });
          });

          // 토글 버튼 클릭 시 서브 항목 표시/숨김
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
          // 서브 항목이 없는 경우 체크박스 단독 처리
          checkbox.addEventListener('change', async () => {
            itemDiv.classList.toggle('checked', checkbox.checked);
            await saveData(itemKey, checkbox.checked);
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
}