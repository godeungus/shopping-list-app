const STORAGE_KEY = "shopping-list-items";

const form = document.getElementById("add-form");
const input = document.getElementById("item-input");
const list = document.getElementById("item-list");
const emptyMessage = document.getElementById("empty-message");

function loadItems() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

let items = loadItems();

function render() {
  list.innerHTML = "";
  emptyMessage.style.display = items.length === 0 ? "block" : "none";

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "item" + (item.checked ? " checked" : "");
    li.dataset.id = item.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.checked;
    checkbox.setAttribute("aria-label", `${item.text} 완료 표시`);

    const text = document.createElement("span");
    text.className = "item-text";
    text.textContent = item.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("aria-label", `${item.text} 삭제`);

    li.append(checkbox, text, deleteBtn);
    list.appendChild(li);
  }
}

function addItem(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  items.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    text: trimmed,
    checked: false,
  });

  saveItems(items);
  render();
}

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  saveItems(items);
  render();
}

function toggleItem(id) {
  const item = items.find((item) => item.id === id);
  if (!item) return;
  item.checked = !item.checked;
  saveItems(items);
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addItem(input.value);
  input.value = "";
  input.focus();
});

list.addEventListener("click", (e) => {
  const li = e.target.closest(".item");
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.matches(".delete-btn")) {
    deleteItem(id);
  } else if (e.target.matches('input[type="checkbox"]')) {
    toggleItem(id);
  }
});

render();
