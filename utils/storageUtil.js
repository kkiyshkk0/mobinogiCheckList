export function getValue(key) {
  return localStorage.getItem(key);
}

export function setValue(key, value) {
  localStorage.setItem(key, value);
}

export function getBoolean(key) {
  return localStorage.getItem(key) === 'true';
}

export function setBoolean(key, value) {
  localStorage.setItem(key, value ? 'true' : 'false');
}

export function removeKeysWithPrefix(prefix) {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(prefix)) keysToRemove.push(key);
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}
