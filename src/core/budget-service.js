/**
 * Budget calculation and balance management service class
 * @author Takumi Harada
 * @date 2026/3/31
 */
import { RECORD_TYPES } from '../constants/app-constants.js';
import { validateRecord } from '../utils/validator.js';

// 収支レコードの CRUD 操作と月次集計を担当する
export class BudgetService {

  /**
   * @param {import('../managers/storage-manager.js').StorageManager} storage
   */
  constructor(storage) {
    this.storage = storage;
  }

  // レコードを追加し、生成した ID を返す
  addRecord(data) {
    const errors = validateRecord(data);
    // バリデーションエラーは throw する。呼び元の KakeiboEngine 側で catch して表示する
    if (errors.length > 0) throw new Error(errors.join(','));

    const records = this.storage.getRecords();
    const record = {
      // Date.now() だけだと同一ミリ秒に追加したとき虫がるので乱数 6 桁を末尾に付ける
      id:        `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date:      data.date,
      type:      data.type,
      category:  data.category,
      amount:    Number(data.amount),
      memo:      data.memo || '',
      createdAt: new Date().toISOString(),
    };
    records.push(record);
    this.storage.saveRecords(records);
    return record.id;
  }
      memo:      data.memo || '',
      createdAt: new Date().toISOString(),
    };
    records.push(record);
    this.storage.saveRecords(records);
    return record.id;
  }

  // 指定 ID のレコードを更新する
  updateRecord(id, data) {
    const errors = validateRecord(data);
    if (errors.length > 0) throw new Error(errors.join(','));

    const records = this.storage.getRecords();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Record not found');

    records[index] = {
      ...records[index],
      date:     data.date,
      type:     data.type,
      category: data.category,
      amount:   Number(data.amount),
      memo:     data.memo || '',
    };
    this.storage.saveRecords(records);
  }

  // 指定 ID のレコードを削除する
  deleteRecord(id) {
    const records = this.storage.getRecords().filter(r => r.id !== id);
    this.storage.saveRecords(records);
  }

  // 指定月のレコードを日付降順で返す
  getRecordsByMonth(yearMonth) {
    return this.storage.getRecords()
      .filter(r => r.date.startsWith(yearMonth))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  // 指定月の収入・支出・残高をまとめたサマリーオブジェクトを返す
  getSummary(yearMonth) {
    const records = this.getRecordsByMonth(yearMonth);
    const income  = records
      .filter(r => r.type === RECORD_TYPES.INCOME)
      .reduce((sum, r) => sum + r.amount, 0);
    const expense = records
      .filter(r => r.type === RECORD_TYPES.EXPENSE)
      .reduce((sum, r) => sum + r.amount, 0);
    return { income, expense, balance: income - expense };
  }

  // 指定月の支出をカテゴリ別に集計したオブジェクトを返す
  // reduce で一発局配。 acc[カテゴリ] がなければ 0 から始める
  getExpenseByCategory(yearMonth) {
    return this.getRecordsByMonth(yearMonth)
      .filter(r => r.type === RECORD_TYPES.EXPENSE)
      .reduce((acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + r.amount;
        return acc;
      }, {});
  }
}
