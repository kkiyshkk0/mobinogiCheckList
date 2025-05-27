fetch('checklist.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('checklist');
    data.forEach(section => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'category';

      const header = document.createElement('h2');
      header.textContent = section.category;
      categoryDiv.appendChild(header);

      section.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';

        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        label.appendChild(checkbox);
        label.append(item.label);

        // 상위 체크박스 클릭 시 하위 체크박스 모두 체크/해제
        checkbox.addEventListener('change', () => {
          itemDiv.classList.toggle('checked', checkbox.checked);

          if (item.subItems) {
            const subCheckboxes = itemDiv.querySelectorAll('.sub-item input[type="checkbox"]');
            const subItems = itemDiv.querySelectorAll('.sub-item');
            subCheckboxes.forEach((subCheckbox, idx) => {
              subCheckbox.checked = checkbox.checked;
              // 하위 체크박스 checked 상태에 따라 checked 클래스 토글
              if (checkbox.checked) {
                subItems[idx].classList.add('checked');
              } else {
                subItems[idx].classList.remove('checked');
              }
            });
          }
        });

        itemDiv.appendChild(label);

        if (item.subItems) {
          const toggleBtn = document.createElement('button');
          toggleBtn.className = 'toggle-btn';
          toggleBtn.style.border = 'none';
          toggleBtn.style.background = 'transparent';
          toggleBtn.style.cursor = 'pointer';

          const icon = document.createElement('img');
          icon.src = 'icons/arrow-left.svg'; // 펼쳐진 상태(하위 보임) → 왼쪽 화살표
          icon.alt = '접기/펼치기';
          icon.style.width = '16px';
          icon.style.height = '16px';

          toggleBtn.appendChild(icon);

          const subList = document.createElement('div');
          subList.className = 'sub-items';
          subList.style.display = 'flex';

          item.subItems.forEach(sub => {
            const subDiv = document.createElement('div');
            subDiv.className = 'sub-item';

            // 기존 코드에서 input과 텍스트를 각각 만들던 걸 label로 묶기
            const label = document.createElement('label');
            const subCheckbox = document.createElement('input');
            subCheckbox.type = 'checkbox';

            label.appendChild(subCheckbox);
            label.append(sub); // sub는 텍스트 (예: '던전1')

            subCheckbox.addEventListener('change', () => {
              // 하위 체크박스 자신의 checked 상태에 따라 취소선 토글
              if (subCheckbox.checked) {
                subDiv.classList.add('checked');
              } else {
                subDiv.classList.remove('checked');
              }

              // 상위 체크박스 상태 갱신
              const subCheckboxes = itemDiv.querySelectorAll('.sub-item input[type="checkbox"]');
              const allChecked = Array.from(subCheckboxes).every(cb => cb.checked);
              checkbox.checked = allChecked;
              itemDiv.classList.toggle('checked', allChecked);
            });

            subDiv.appendChild(label);
            subList.appendChild(subDiv);
          });

          toggleBtn.addEventListener('click', () => {
            const isHidden = subList.style.display === 'none';
            subList.style.display = isHidden ? 'flex' : 'none';
            icon.src = isHidden ? 'icons/arrow-left.svg' : 'icons/arrow-right.svg';
          });

          itemDiv.appendChild(toggleBtn);
          itemDiv.appendChild(subList);
        }

        categoryDiv.appendChild(itemDiv);
      });

      container.appendChild(categoryDiv);
    });
  });
