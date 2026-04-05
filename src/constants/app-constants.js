/**
 * Application-wide constants (storage keys, allowed paths, etc.)
 * @author Takumi Harada
 * @date 2026/3/31
 */
// 収入カテゴリ一覧
export const INCOME_CATEGORIES = ['給与', 'ボーナス', '副収入', '投資', 'その他収入'];

// 支出カテゴリ一覧
export const EXPENSE_CATEGORIES = ['食費', '交通費', '光熱費', '通信費', '娯楽', '医療', '衣類', '日用品', 'その他支出'];

// LocalStorage のキー識別子
export const STORAGE_KEYS = {
  RECORDS: 'moneybook_records',
  BUDGETS: 'moneybook_budgets',
};

// CSV エクスポートのヘッダー行
export const CSV_HEADERS = ['日付', '種別', 'カテゴリ', '金額', 'メモ'];

// 収支の種別識別子
export const RECORD_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};
