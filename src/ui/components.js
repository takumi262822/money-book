/**
 * UI component rendering class
 * @author Takumi Harada
 * @date 2026/3/31
 */
import { escapeHtml } from '../utils/xss.js';
import { formatCurrency, formatDateShort } from '../utils/formatter.js';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants/app-constants.js';

// 単一の収支レコードカード HTML を生成して返す
export function renderRecordItem(record) {
  const typeClass = record.type;
  const sign      = record.type === 'income' ? '+' : '-';
  const amount    = formatCurrency(record.amount);
  const memo      = record.memo ? `<span>${escapeHtml(record.memo)}</span>` : '';

  return `
    <div class="record-item" data-id="${escapeHtml(record.id)}" role="button" tabindex="0">
      <div class="record-dot ${typeClass}"></div>
      <div class="record-info">
        <div class="record-category">${escapeHtml(record.category)}</div>
        <div class="record-meta">
          <span>${formatDateShort(record.date)}</span>
          ${memo}
        </div>
      </div>
      <div class="record-amount ${typeClass}">${sign}${amount}</div>
    </div>
  `;
}

// 種別に応じたカテゴリ選択肢 HTML を生成して返す
export function renderCategoryOptions(type, selected = '') {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return categories
    .map(cat => `<option value="${escapeHtml(cat)}" ${cat === selected ? 'selected' : ''}>${escapeHtml(cat)}</option>`)
    .join('');
}
