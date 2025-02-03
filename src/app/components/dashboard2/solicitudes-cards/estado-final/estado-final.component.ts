import { Component, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexFill,
  ApexGrid,
  ApexDataLabels,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../../material.module';

export interface totalEarnChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  fill: ApexFill;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
}

@Component({
  selector: 'app-solicitudes-estado',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule],
  templateUrl: './estado-final.component.html',
})
export class AppRequestStateComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public totalEarnChart!: Partial<totalEarnChart> | any;

  constructor() {
    this.totalEarnChart = {
      series: [7, 1],
      chart: {
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        width: 200,
        type: "pie",
        offsetX: -45,  // This will move the chart to the left
        offsetY: -10  // This will move the chart to the top
      },
      colors: ["#3683d8", "#e3e1f6"],
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
        offsetX: -15  // This will also move the legend to the left
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
        "Aprob.",
        "Rech."
      ],


    };
  }
}
