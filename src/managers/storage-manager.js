/**
 * localStorage data save and load class
 * @author Takumi Harada
 * @date 2026/3/31
 */
import { STORAGE_KEYS } from '../constants/app-constants.js';

// LocalStorage への読み書きを一元管理する
export class StorageManager {

  // 保存済みのすべての収支レコードを配列で取得する
  getRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECORDS) || '[]');
    } catch {
      return [];
    }
  }

  // 収支レコード配列を LocalStorage に保存する
  saveRecords(records) {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }

  // 保存済みのすべての予算設定をオブジェクトで取得する
  getBudgets() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS) || '{}');
    } catch {
      return {};
    }
  }

  // 予算設定オブジェクトを LocalStorage に保存する
  saveBudgets(budgets) {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }
}
