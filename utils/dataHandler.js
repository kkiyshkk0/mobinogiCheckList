// dataHandler.js
import { getValue, setValue } from './storageUtil.js'; // 로컬 저장소(localStorage) 유틸 함수
import { rtdb, ref, get, update } from '../auth.js'; // Realtime Database 관련 함수

let currentUser = null; // 현재 로그인된 사용자 정보를 저장하는 변수

// 로그인 상태가 바뀔 때 main.js에서 호출해 사용자 정보를 저장
export function setCurrentUser(user) {
  currentUser = user;
}

// Firestore에서 key마다 분리 저장하던 것처럼 localStorage와 구분을 위해 prefix 사용
const STORAGE_PREFIX = 'checklist_';

/**
 * 데이터 로딩 함수
 * 로그인된 경우: Realtime Database에서 유저별 데이터 가져와 key에 해당하는 값 반환
 * 비로그인 상태: localStorage에서 값 반환
 */
export async function loadData(key) {
  const fullKey = STORAGE_PREFIX + key;

  if (currentUser) {
    try {
      const userRef = ref(rtdb, `checklists/${currentUser.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return data[sanitizeKey(fullKey)] ?? null;
      } else {
        return null;
      }
    } catch (err) {
      console.error('Realtime Database 로드 실패:', err);
      return null;
    }
  } else {
    return getValue(fullKey);
  }
}

/**
 * 데이터 저장 함수
 * 로그인된 경우: Realtime Database에 병합 저장 (update)
 * 비로그인 상태: localStorage에 저장
 */
export async function saveData(key, value) {
  const fullKey = STORAGE_PREFIX + key;

  if (currentUser) {
    try {
      const userRef = ref(rtdb, `checklists/${currentUser.uid}`);
      // update는 기존 데이터 병합 저장
      await update(userRef, {
        [sanitizeKey(fullKey)]: value
      });
    } catch (err) {
      console.error('Realtime Database 저장 실패:', err);
    }
  } else {
    setValue(fullKey, value);
  }
}

function sanitizeKey(key) {
  return key
    .replace(/\./g, '_dot_')
    .replace(/\$/g, '_dollar_')
    .replace(/#/g, '_hash_')
    .replace(/\[/g, '_lbr_')
    .replace(/\]/g, '_rbr_')
    .replace(/\//g, '_slash_');
}