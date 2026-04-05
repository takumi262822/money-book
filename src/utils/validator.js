/**
 * Input validation utility class
 * @author Takumi Harada
 * @date 2026/3/31
 */
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, RECORD_TYPES } from '../constants/app-constants.js';
import { ERROR_CODES } from '../constants/code-definitions.js';

// 収支レコードの入力値を検証し、エラーコードの配列を返す
export function validateRecord({ date, type, category, amount }) {
  const errors = [];

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push(ERROR_CODES.INVALID_DATE);
  }

  if (!type || !Object.values(RECORD_TYPES).includes(type)) {
    errors.push(ERROR_CODES.INVALID_TYPE);
  }

  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  if (!category || !allCategories.includes(category)) {
    errors.push(ERROR_CODES.MISSING_CATEGORY);
  }

  const num = Number(amount);
  if (!amount || isNaN(num) || num <= 0 || !Number.isInteger(num)) {
    errors.push(ERROR_CODES.INVALID_AMOUNT);
  }

  return errors;
}

// 予算設定の入力値を検証し、エラーコードの配列を返す
export function validateBudget({ category, limit }) {
  const errors = [];

  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  if (!category || !allCategories.includes(category)) {
    errors.push(ERROR_CODES.MISSING_CATEGORY);
  }

  const num = Number(limit);
  if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
    errors.push(ERROR_CODES.INVALID_AMOUNT);
  }

  return errors;
}
