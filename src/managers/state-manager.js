/**
 * Game state (start/playing/gameover) management class
 * @author Takumi Harada
 * @date 2026/3/31
 */
import { getCurrentYearMonth } from '../utils/formatter.js';
import { MODAL_STATE } from '../constants/code-definitions.js';

// アプリの UI 状態（表示月・モーダル状態）を保持する
export class StateManager {

  constructor() {
    this.currentYearMonth = getCurrentYearMonth();
    this.modalState = MODAL_STATE.CLOSED;
    this.editingRecordId = null;
  }

  // 表示月を前月に移動する
  prevMonth() {
    const [year, month] = this.currentYearMonth.split('-').map(Number);
    const d = new Date(year, month - 2, 1);
    this.currentYearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  // 表示月を翌月に移動する
  nextMonth() {
    const [year, month] = this.currentYearMonth.split('-').map(Number);
    const d = new Date(year, month, 1);
    this.currentYearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }
}
