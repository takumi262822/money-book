/**
 * Page common header rendering class
 * @author Takumi Harada
 * @date 2026/3/31
 */
import { formatYearMonth } from '../utils/formatter.js';

// ヘッダー HTML（ロゴ + 月ナビゲーション）を生成して返す
export function renderHeader(yearMonth) {
  return `
    <header class="site-header">
      <div class="logo">Money<span>Book</span></div>
      <nav class="month-nav" aria-label="月選択">
        <button id="prev-month-btn" aria-label="前月">&#8249;</button>
        <span class="month-label" aria-live="polite">${formatYearMonth(yearMonth)}</span>
        <button id="next-month-btn" aria-label="翌月">&#8250;</button>
      </nav>
    </header>
  `;
}
