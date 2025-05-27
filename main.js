fetch('checklist.json')
  .then(res => res.json())
  .then(data => renderChecklist(data));

function renderChecklist(data) {
  const container = document.getElementById('checklist');
  container.innerHTML = '';

  data.forEach((group, index) => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'checklist-group';

    const header = document.createElement('div');
    header.className = 'item-label';

    if (group.items.length > 0) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'toggle-button';
      toggleBtn.textContent = '▼';
      toggleBtn.onclick = () => {
        const subItems = groupDiv.querySelector('.sub-items');
        const isVisible = subItems.style.display !== 'none';
        subItems.style.display = isVisible ? 'none' : 'flex';
        toggleBtn.textContent = isVisible ? '▶' : '▼';
      };
      header.appendChild(toggleBtn);
    }

    const title = document.createElement('span');
    title.textContent = group.title;
    header.appendChild(title);
    groupDiv.appendChild(header);

    if (group.items.length > 0) {
      const subList = document.createElement('div');
      subList.className = 'sub-items';
      group.items.forEach((item, i) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.checked;
        checkbox.onchange = () => {
          label.classList.toggle('checked', checkbox.checked);
        };
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(item.label));
        if (item.checked) label.classList.add('checked');
        subList.appendChild(label);
      });
      groupDiv.appendChild(subList);
    }

    container.appendChild(groupDiv);
  });
}
