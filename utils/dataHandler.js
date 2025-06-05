// dataHandler.js
import { getValue, setValue } from './storageUtil.js'; // 로컬 저장소(localStorage) 유틸 함수
import { db } from '../auth.js'; // Firebase Firestore 인스턴스
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

let currentUser = null; // 현재 로그인된 사용자 정보를 저장하는 변수

// 로그인 상태가 바뀔 때 main.js에서 호출해 사용자 정보를 저장
export function setCurrentUser(user) {
  currentUser = user;
}

// Firestore와 localStorage에서 키 충돌 방지를 위한 prefix
const STORAGE_PREFIX = 'checklist_';

/**
 * 데이터 로딩 함수
 * 로그인된 경우: Firestore에서 해당 유저의 문서에서 key에 해당하는 값 반환
 * 비로그인 상태: localStorage에서 값 반환
 */
export async function loadData(key) {
  const fullKey = STORAGE_PREFIX + key; // prefix 포함된 키 생성

  if (currentUser) {
    // 로그인 상태면 Firestore에서 유저별 문서를 참조
    const userDoc = doc(db, "checklists", currentUser.uid);
    const snap = await getDoc(userDoc);

    // 문서가 존재한다면 해당 key의 값 반환, 없으면 null
    return snap.exists() ? snap.data()[fullKey] || null : null;
  } else {
    // 비로그인 상태면 localStorage에서 값 반환
    return getValue(fullKey);
  }
}

/**
 * 데이터 저장 함수
 * 로그인된 경우: Firestore에 병합 저장
 * 비로그인 상태: localStorage에 저장
 */
export async function saveData(key, value) {
  const fullKey = STORAGE_PREFIX + key; // prefix 포함된 키 생성

  if (currentUser) {
    // 로그인 상태면 Firestore 문서 참조
    const userDoc = doc(db, "checklists", currentUser.uid);
    const snap = await getDoc(userDoc);

    // 기존 데이터 유지하며 새 key-value 병합 저장
    const existingData = snap.exists() ? snap.data() : {};
    await setDoc(userDoc, {
      ...existingData,
      [fullKey]: value
    });
  } else {
    // 비로그인 상태면 localStorage에 저장
    setValue(fullKey, value);
  }
}
