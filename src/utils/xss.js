/**
 * XSS protection and escape utility class
 * @author Takumi Harada
 * @date 2026/3/31
 */
// HTML 特殊文字をエスケープして XSS を防ぐ
export function escapeHtml(str) {
  // 文字列以外が渡された場合は安全のため空文字を返す
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
