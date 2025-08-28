import { Component, OnInit } from '@angular/core';
import {
  Chart,
  registerables
} from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  ngOnInit(): void {
    Chart.register(...registerables); // ✅ Register all necessary components
    this.createBarChart();
    this.createLineChart();
  }

  createBarChart() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'PM-KISAN',
          'MISS',
          'PMFBY',
          'PM-KMY'
        ],
        datasets: [{
          label: 'Interest Rate (%)',
          data: [3.8, 7, 7.5, 8.2],
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              generateLabels: (chart) => {
                const original = Chart.defaults.plugins.legend.labels.generateLabels;
                const labels = original(chart);
                return labels;
              }
            }
          },
          title: {
            display: true,
            text: 'Government Schemes - Interest Rates (%)'
          }
        }
      }
    });
  }
  

  createLineChart() {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'PM-KISAN',
          'MISS',
          'PMFBY',
          'PM-KMY'
        ],
        datasets: [{
          label: 'Farmers Enrolled (Cr)',
          data: [11, 7.75, 5.1, 2.3],
          borderColor: '#4e73df',
          backgroundColor: 'rgba(78, 115, 223, 0.2)',
          borderWidth: 2,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
