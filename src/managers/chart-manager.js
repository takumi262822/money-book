/**
 * Chart rendering and chart data generation class
 * @author Takumi Harada
 * @date 2026/3/31
 */
/* global Chart */

// Chart.js を使って支出カテゴリのドーナツチャートを描画する
export class ChartManager {

  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.chart = null;
    this.colors = [
      '#00D68F', '#4D90FE', '#FF6B6B', '#FFB347', '#A78BFA',
      '#67E8F9', '#FDE68A', '#F9A8D4', '#6EE7B7', '#FCA5A5',
    ];
  }

  // カテゴリ別支出データでチャートを描画または差分更新する
  render(categoryData) {
    const labels = Object.keys(categoryData);
    const data   = Object.values(categoryData);

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.data.datasets[0].backgroundColor = this.colors.slice(0, labels.length);
      this.chart.update();
      return;
    }

    this.chart = new Chart(this.canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: this.colors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#0B1437',
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(232, 240, 254, 0.8)',
              font: { size: 12 },
              padding: 16,
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ¥${ctx.parsed.toLocaleString('ja-JP')}`,
            },
          },
        },
      },
    });
  }

  // チャートインスタンスを破棄する
  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
