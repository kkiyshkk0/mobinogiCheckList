// createChecklist.js

export function createChecklist(container, data) {
  data.forEach((superCat, superIdx) => {
    const superCatDiv = document.createElement('div');
    superCatDiv.className = 'super-category';

    const superHeader = document.createElement('h1');
    superHeader.textContent = superCat.superCategory;
    superHeader.classList.add('super-header');

    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'categories-container';

    const collapseKey = `collapseState:${superCat.superCategory}`;
    const isCollapsed = localStorage.getItem(collapseKey) === 'true';
    categoriesContainer.style.display = isCollapsed ? 'none' : 'block';

    superHeader.addEventListener('click', () => {
      const currentlyHidden = categoriesContainer.style.display === 'none';
      categoriesContainer.style.display = currentlyHidden ? 'block' : 'none';
      localStorage.setItem(collapseKey, !currentlyHidden);
    });

    superCatDiv.appendChild(superHeader);

    superCat.categories.forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'category';

      const header = document.createElement('h2');
      header.textContent = category.category;
      categoryDiv.appendChild(header);

      const itemsContainer = document.createElement('div');
      itemsContainer.className = 'items-container';

      category.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.classList.add(superIdx % 2 === 0 ? 'bg-light' : 'bg-dark');

        const topRow = document.createElement('div');
        topRow.className = 'item-top-row';

        const label = document.createElement('label');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const itemKey = `checklist:${superCat.superCategory}:${category.category}:${item.label}`;
        const hideKey = `hide:${superCat.superCategory}:${category.category}:${item.label}`;

        if (localStorage.getItem(hideKey) === 'true') {
          itemDiv.style.display = 'none';
        }

        const hideBtn = document.createElement('button');
        hideBtn.textContent = 'X';
        hideBtn.className = 'hide-btn';
        hideBtn.title = '숨기기';

        hideBtn.addEventListener('click', () => {
          itemDiv.style.display = 'none';
          localStorage.setItem(hideKey, 'true');
        });

        topRow.appendChild(hideBtn);

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

          const icon = document.createElement('img');
          icon.src = 'icons/arrow-up.svg';
          icon.alt = '접기/펼치기';

          toggleBtn.appendChild(icon);
          topRow.appendChild(toggleBtn);
        }

        itemDiv.appendChild(topRow);

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
            const subSaved = localStorage.getItem(subKey);

            if (subSaved === 'true') {
              subCheckbox.checked = true;
              subDiv.classList.add('checked');
            }

            subLabel.appendChild(subCheckbox);
            subLabel.append(sub);
            subDiv.appendChild(subLabel);

            subCheckbox.addEventListener('change', () => {
              localStorage.setItem(subKey, subCheckbox.checked);

              if (subCheckbox.checked) subDiv.classList.add('checked');
              else subDiv.classList.remove('checked');

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
              subItems[idx].classList.toggle('checked', checkbox.checked);
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
}
