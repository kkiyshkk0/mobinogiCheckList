// storageUtil.js

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