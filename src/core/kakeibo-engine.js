/**
 * Household account book core logic class
 * @author Takumi Harada
 * @date 2026/3/31
 */
import { StorageManager }  from '../managers/storage-manager.js';
import { StateManager }    from '../managers/state-manager.js';
import { ChartManager }    from '../managers/chart-manager.js';
import { CsvManager }      from '../managers/csv-manager.js';
import { BudgetService }   from './budget-service.js';
import { renderHeader }    from '../ui/header.js';
import { renderFooter }    from '../ui/footer.js';
import { renderRecordItem, renderCategoryOptions } from '../ui/components.js';
import { formatCurrency }  from '../utils/formatter.js';
import { escapeHtml }      from '../utils/xss.js';
import { MODAL_STATE }     from '../constants/code-definitions.js';

// アプリ全体の初期化・イベント委譲・画面更新を担当する
export class KakeiboEngine {

  constructor() {
    this.storage = new StorageManager();
    this.state   = new StateManager();
    this.service = new BudgetService(this.storage);
    this.chart   = new ChartManager('expense-chart');
    this.csv     = new CsvManager();
  }

  // アプリを初期化して DOM にレンダリングする
  init() {
    this._renderShell();
    this._bindEvents();
    this._refresh();
  }

  // ヘッダーとフッターを描画する
  _renderShell() {
    document.getElementById('site-header').innerHTML = renderHeader(this.state.currentYearMonth);
    document.getElementById('site-footer').innerHTML = renderFooter();
  }

  // クリック・変更・送信イベントをまとめて委譲する
  _bindEvents() {
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (t.id === 'prev-month-btn')                          { this._prevMonth(); }
      else if (t.id === 'next-month-btn')                     { this._nextMonth(); }
      else if (t.id === 'add-btn')                            { this._openAddModal(); }
      else if (t.id === 'cancel-btn')                         { this._closeModal(); }
      else if (t.classList.contains('modal-overlay'))         { this._closeModal(); }
      else if (t.id === 'delete-btn')                         { this._deleteRecord(); }
      else if (t.id === 'csv-export-btn')                     { this._exportCsv(); }
      else {
        const item = t.closest('.record-item');
        if (item) this._openEditModal(item.dataset.id);
      }
    });

    // 種別ラジオボタン変更でカテゴリ選択肢を更新する
    document.addEventListener('change', (e) => {
      if (e.target.name === 'type') {
        this._updateCategoryOptions(e.target.value);
      }
    });

    document.getElementById('record-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this._submitRecord();
    });
  }

  // 前月に切り替えてビューを更新する
  _prevMonth() {
    this.state.prevMonth();
    this._updateHeader();
    this._refresh();
  }

  // 翌月に切り替えてビューを更新する
  _nextMonth() {
    this.state.nextMonth();
    this._updateHeader();
    this._refresh();
  }

  // サマリー・チャート・一覧をまとめて再描画する
  _refresh() {
    const ym          = this.state.currentYearMonth;
    const summary      = this.service.getSummary(ym);
    const records      = this.service.getRecordsByMonth(ym);
    const categoryData = this.service.getExpenseByCategory(ym);

    this._renderSummary(summary);
    this._renderRecords(records);
    this._renderChart(categoryData);
  }

  // サマリーカードの金額テキストを更新する
  _renderSummary({ income, expense, balance }) {
    document.getElementById('total-income').textContent  = formatCurrency(income);
    document.getElementById('total-expense').textContent = formatCurrency(expense);
    document.getElementById('total-balance').textContent = formatCurrency(balance);
  }

  // 収支一覧を描画する
  _renderRecords(records) {
    const list  = document.getElementById('records-list');
    const empty = document.getElementById('records-empty');

    if (records.length === 0) {
      list.innerHTML = '';
      list.appendChild(empty);
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    list.innerHTML = records.map(renderRecordItem).join('');
  }

  // 支出カテゴリのドーナツチャートを描画する
  _renderChart(categoryData) {
    const chartEmpty = document.getElementById('chart-empty');
    if (Object.keys(categoryData).length === 0) {
      chartEmpty.hidden = false;
      this.chart.destroy();
      return;
    }
    chartEmpty.hidden = true;
    this.chart.render(categoryData);
  }

  // ヘッダーの月表示のみを更新する
  _updateHeader() {
    document.getElementById('site-header').innerHTML = renderHeader(this.state.currentYearMonth);
  }

  // 追加モーダルを初期化して開く
  _openAddModal() {
    this.state.modalState      = MODAL_STATE.ADD;
    this.state.editingRecordId = null;

    document.getElementById('modal-title').textContent  = '記録を追加';
    document.getElementById('submit-btn').textContent   = '追加';
    document.getElementById('delete-btn').hidden        = true;
    document.getElementById('form-error').hidden        = true;
    document.getElementById('record-date').value        = new Date().toISOString().slice(0, 10);
    document.getElementById('record-amount').value      = '';
    document.getElementById('record-memo').value        = '';
    document.querySelector('input[name="type"][value="expense"]').checked = true;
    this._updateCategoryOptions('expense');

    document.getElementById('record-modal').hidden = false;
  }

  // 編集対象レコードの値をフォームに設定してモーダルを開く
  _openEditModal(id) {
    const record = this.storage.getRecords().find(r => r.id === id);
    if (!record) return;

    this.state.modalState      = MODAL_STATE.EDIT;
    this.state.editingRecordId = id;

    document.getElementById('modal-title').textContent = '記録を編集';
    document.getElementById('submit-btn').textContent  = '更新';
    document.getElementById('delete-btn').hidden       = false;
    document.getElementById('form-error').hidden       = true;
    document.getElementById('record-date').value       = record.date;
    document.getElementById('record-amount').value     = record.amount;
    document.getElementById('record-memo').value       = record.memo;
    document.querySelector(`input[name="type"][value="${escapeHtml(record.type)}"]`).checked = true;
    this._updateCategoryOptions(record.type, record.category);

    document.getElementById('record-modal').hidden = false;
  }

  // モーダルを閉じて状態をリセットする
  _closeModal() {
    document.getElementById('record-modal').hidden = true;
    this.state.modalState      = MODAL_STATE.CLOSED;
    this.state.editingRecordId = null;
  }

  // 種別に合わせてカテゴリ選択肢を更新する
  _updateCategoryOptions(type, selected = '') {
    document.getElementById('record-category').innerHTML = renderCategoryOptions(type, selected);
  }

  // フォーム値を取得してレコードの追加または更新を実行する
  _submitRecord() {
    const form = document.getElementById('record-form');
    const data = {
      date:     form.querySelector('#record-date').value,
      type:     form.querySelector('input[name="type"]:checked').value,
      category: form.querySelector('#record-category').value,
      amount:   form.querySelector('#record-amount').value,
      memo:     form.querySelector('#record-memo').value,
    };

    try {
      if (this.state.modalState === MODAL_STATE.ADD) {
        this.service.addRecord(data);
      } else {
        this.service.updateRecord(this.state.editingRecordId, data);
      }
      this._closeModal();
      this._refresh();
    } catch {
      const errEl = document.getElementById('form-error');
      errEl.textContent = '入力値を確認してください';
      errEl.hidden = false;
    }
  }

  // 編集中レコードを削除してビューを更新する
  _deleteRecord() {
    if (!this.state.editingRecordId) return;
    if (!confirm('このレコードを削除しますか？')) return;
    this.service.deleteRecord(this.state.editingRecordId);
    this._closeModal();
    this._refresh();
  }

  // 現在月のレコードを CSV ファイルとして出力する
  _exportCsv() {
    const records = this.service.getRecordsByMonth(this.state.currentYearMonth);
    this.csv.export(records, this.state.currentYearMonth);
  }
}
