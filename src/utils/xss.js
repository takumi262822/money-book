/**
 * XSS protection and escape utility class
 * @author Takumi Harada
 * @date 2026/3/31
 */
// HTML 特殊文字をエスケープして XSS を防ぐ
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
