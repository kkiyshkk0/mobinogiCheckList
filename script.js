const now = new Date();
const today = now.toISOString().slice(0, 10);
const weekKey = getWeekKey(now);

fetch("checklist.json")
  .then(res => res.json())
  .then(data => {
    renderList("daily", data.daily);
    renderList("weekly", data.weekly);
    loadStatus("daily", today);
    loadStatus("weekly", weekKey);
  });

function renderList(key, items, path = "") {
  const ul = document.getElementById(`${key}-list`);
  if (!path) ul.innerHTML = "";

  items.forEach((item, i) => {
    const li = document.createElement("li");
    let itemPath = path ? `${path}-${i}` : `${key}-${i}`;

    if (typeof item === "string") {
      li.textContent = item;
      li.dataset.path = itemPath;
      li.onclick = (e) => {
        e.stopPropagation();
        toggleItem(li, key);
      };
    } else if (typeof item === "object" && item.title && Array.isArray(item.sub)) {
      const toggleBtn = document.createElement("div");
      toggleBtn.className = "toggle-btn collapsed";
      toggleBtn.textContent = "▶";
      toggleBtn.onclick = (e) => {
        e.stopPropagation();
        if (toggleBtn.classList.contains("collapsed")) {
          toggleBtn.classList.remove("collapsed");
          toggleBtn.classList.add("expanded");
          toggleBtn.textContent = "▼";
          subUl.style.display = "block";
        } else {
          toggleBtn.classList.remove("expanded");
          toggleBtn.classList.add("collapsed");
          toggleBtn.textContent = "▶";
          subUl.style.display = "none";
        }
      };
      li.appendChild(toggleBtn);

      const spanTitle = document.createElement("span");
      spanTitle.textContent = item.title;
      spanTitle.style.fontWeight = "bold";
      spanTitle.style.flexGrow = "1";
      li.appendChild(spanTitle);

      li.dataset.path = itemPath;
      li.onclick = (e) => {
        e.stopPropagation();
        toggleItem(li, key);
      };

      const subUl = document.createElement("ul");
      subUl.style.paddingLeft = "0";
      subUl.style.marginTop = "0.5rem";
      subUl.style.display = "none";
      li.appendChild(subUl);

      renderSubList(key, item.sub, subUl, itemPath + "-sub");
    }
    if (!path) ul.appendChild(li);
  });
}

function renderSubList(key, items, ul, path) {
  items.forEach((item, i) => {
    const li = document.createElement("li");
    const itemPath = `${path}-${i}`;
    li.textContent = item;
    li.dataset.path = itemPath;
    li.style.fontWeight = "normal";
    li.onclick = (e) => {
      e.stopPropagation();
      toggleItem(li, key);
    };
    ul.appendChild(li);
  });
}

function toggleItem(el, key) {
  el.classList.toggle("checked");
  saveStatus(key);
}

function saveStatus(key) {
  const items = document.querySelectorAll(`#${key}-list li`);
  const checkedPaths = [];
  items.forEach(item => {
    if (item.classList.contains("checked")) {
      checkedPaths.push(item.dataset.path);
    }
  });
  localStorage.setItem(`${key}-checked`, JSON.stringify(checkedPaths));
  localStorage.setItem(`${key}-date`, key === "daily" ? today : weekKey);
}

function loadStatus(key, expectedDate) {
  const savedDate = localStorage.getItem(`${key}-date`);
  const checkedPaths = savedDate === expectedDate
    ? JSON.parse(localStorage.getItem(`${key}-checked`) || "[]")
    : [];

  const items = document.querySelectorAll(`#${key}-list li`);
  items.forEach(item => {
    const path = item.dataset.path;
    item.classList.toggle("checked", checkedPaths.includes(path));
    item.onclick = (e) => {
      e.stopPropagation();
      toggleItem(item, key);
    };
  });
}

function getWeekKey(date) {
  const d = new Date(date);
  const monday = new Date(d.setDate(d.getDate() - d.getDay() + 1));
  return monday.toISOString().slice(0, 10);
}
