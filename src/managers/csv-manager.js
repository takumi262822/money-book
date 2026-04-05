/**
 * CSV export and import processing class
 * @author Takumi Harada
 * @date 2026/3/31
 */
import { CSV_HEADERS } from '../constants/app-constants.js';

// 収支レコード配列を UTF-8 BOM 付き CSV としてダウンロードさせる
export class CsvManager {

  // 指定月のレコードを CSV ファイルとしてダウンロードする
  export(records, yearMonth) {
    const rows = records.map(r => [
      r.date,
      r.type === 'income' ? '収入' : '支出',
      r.category,
      r.amount,
      r.memo,
    ]);

    const csvContent = [CSV_HEADERS, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moneybook_${yearMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
