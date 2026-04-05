/**
 * Date and amount format utility class
 * @author Takumi Harada
 * @date 2026/3/31
 */
// 数値を日本円の通貨表記にフォーマットする（¥ + 千区切り整数）
export function formatCurrency(amount) {
  return `¥${new Intl.NumberFormat('ja-JP').format(amount)}`;
}

// YYYY-MM-DD を M/D の短縮表記に変換する
export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const [, month, day] = dateStr.split('-');
  return `${parseInt(month, 10)}/${parseInt(day, 10)}`;
}

// YYYY-MM を YYYY年M月 の日本語表記に変換する
export function formatYearMonth(yearMonth) {
  if (!yearMonth) return '';
  const [year, month] = yearMonth.split('-');
  return `${year}年${parseInt(month, 10)}月`;
}

// 現在の年月を YYYY-MM 形式で返す
export function getCurrentYearMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
