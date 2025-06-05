// storageUtil.js

export function getValue(key) {
  const val = localStorage.getItem(key);
  try {
    return JSON.parse(val); // JSON 형식이라면 객체/배열로 변환
  } catch {
    return val; // JSON이 아니면 그냥 문자열 반환
  }
}

export function setValue(key, value) {
  if (typeof value === 'string') {
    localStorage.setItem(key, value);
  } else {
    localStorage.setItem(key, JSON.stringify(value)); // 객체/배열 등 JSON 변환 후 저장
  }
}