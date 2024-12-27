import { Component, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexFill,
  ApexDataLabels,
  ApexResponsive,
  NgApexchartsModule,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../../material.module';
import { he } from 'date-fns/locale';

export interface totalEarnChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  tooltip: ApexTooltip;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
  labels: any;
  title: ApexTitleSubtitle;
  legend: any;
}

@Component({
  selector: 'app-solicitudes-pendientes',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule],
  templateUrl: './solicitudes-pendientes.component.html',
})
export class AppPendingRequestsComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public totalEarnChart!: Partial<totalEarnChart> | any;

  constructor() {
    this.totalEarnChart = {
      series: [3, 2],
      chart: {
      fontFamily: "'Plus Jakarta Sans', sans-serif;", 
      width: 200,
      height: 200,
      type: "pie",
      offsetX: -40,  // This will move the chart to the left
      // This will move the chart to the top
          },
          colors: ["#7869cd", "#e3e1f6", "#a3d2ca"],
          theme: {
          monochrome: {
            enabled: false
          }
          },
          dataLabels: {
          enabled: false
          },
          legend: {
          position: "bottom",
          offsetX: -23  // This will also move the legend to the left
      },
      responsive: [
      {
        breakpoint: 1279,
        options: {
        chart: {
          width: '100%',
          offsetX: 0  // Adjust the chart position
        },
        legend: {
          offsetX: 0  // Adjust the legend position
        }
        }
      },
      {
        breakpoint: 480,
        options: {
        chart: {
          width: '100%',
          offsetX: 0  // Center the chart horizontally
        },
        legend: {
          offsetX: 0  // Center the legend horizontally
        }
        }
      }
      ],
      labels: [
      "Pendientes",
      "Finalizadas",
      "No iniciadas",
      ]
    };
  }
}
