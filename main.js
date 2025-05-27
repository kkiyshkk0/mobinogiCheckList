fetch('checklist.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('checklist');

    data.forEach((superCat, superIdx) => {
      const superCatDiv = document.createElement('div');
      superCatDiv.className = 'super-category';

      const superHeader = document.createElement('h1');
      superHeader.textContent = superCat.superCategory;
      superHeader.style.cursor = 'pointer';
      superHeader.style.userSelect = 'none';

      // 카테고리 전체 컨테이너 (하위 카테고리 전부 감쌈)
      const categoriesContainer = document.createElement('div');
      categoriesContainer.className = 'categories-container';

      // 첫 최상위 항목만 기본 펼침, 나머지는 접힘
      if (superIdx !== 0) {
        categoriesContainer.style.display = 'none';
      }

      // 최상위 항목 제목 클릭 시 접기/펼치기
      superHeader.addEventListener('click', () => {
        const isHidden = categoriesContainer.style.display === 'none';
        categoriesContainer.style.display = isHidden ? 'block' : 'none';
      });

      superCatDiv.appendChild(superHeader);

      // 하위 카테고리 렌더링
      superCat.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';

        const header = document.createElement('h2');
        header.textContent = category.category;
        header.style.userSelect = 'none';

        // 기본적으로 하위 카테고리는 모두 펼쳐진 상태로 유지 (접기/펼치기 기능 없음)
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

              subLabel.appendChild(subCheckbox);
              subLabel.append(sub);
              subDiv.appendChild(subLabel);

              subCheckbox.addEventListener('change', () => {
                if (subCheckbox.checked) {
                  subDiv.classList.add('checked');
                } else {
                  subDiv.classList.remove('checked');
                }

                const subCheckboxes = itemDiv.querySelectorAll('.sub-item input[type="checkbox"]');
                const allChecked = Array.from(subCheckboxes).every(cb => cb.checked);
                checkbox.checked = allChecked;
                itemDiv.classList.toggle('checked', allChecked);
              });

              subList.appendChild(subDiv);
            });

            checkbox.addEventListener('change', () => {
              itemDiv.classList.toggle('checked', checkbox.checked);

              const subCheckboxes = subList.querySelectorAll('input[type="checkbox"]');
              const subItems = subList.querySelectorAll('.sub-item');
              subCheckboxes.forEach((subCheckbox, idx) => {
                subCheckbox.checked = checkbox.checked;
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
