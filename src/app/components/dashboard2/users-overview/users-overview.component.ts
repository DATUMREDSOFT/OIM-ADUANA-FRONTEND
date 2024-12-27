import { Component, ViewChild, Input } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

export interface usersoverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  stroke: ApexStroke;
}

@Component({
  selector: 'app-users-overview',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule, TablerIconsModule],
  templateUrl: './users-overview.component.html',
})
export class AppUsersOverviewComponent {
  @ViewChild('chart', { static: false }) chart: ChartComponent;
  @Input() selectedCard: string = 'users';
  public usersoverviewChart!: Partial<usersoverviewChart> | any;

  constructor() {
    this.usersoverviewChart = {
      series: [4, 8],
      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        toolbar: {
          show: false,
        },
        height: 275,
      },
      labels: ['Activos', 'Inactivos'],
      colors: ["#7869cd", "#e3e1f6"],
      plotOptions: {
        pie: {
          donut: {
            size: '89%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                offsetY: 7,
              },
              value: {
                show: false,
              },
              total: {
                show: true,
                color: '#7869cd',
                fontSize: '20px',
                fontWeight: '600',
                label: '12 usuarios',
                formatter: () => '12',
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false,
      },
    };
  }

  ngOnChanges() {
    this.updateChartData();
  }

  updateChartData() {
    if (this.selectedCard === 'users') {
      this.usersoverviewChart.series = [7, 5];
      this.usersoverviewChart.labels = ['Activos', 'Inactivos'];
      this.usersoverviewChart.plotOptions.pie.donut.labels.total.label = '12 usuarios';
      this.usersoverviewChart.plotOptions.pie.donut.labels.total.formatter = () => '12';
    } else if (this.selectedCard === 'digitadores') {
      this.usersoverviewChart.series = [2, 2];
      this.usersoverviewChart.labels = ['Activos', 'Inactivos'];
      this.usersoverviewChart.plotOptions.pie.donut.labels.total.label = 'Usuarios Digitadores';
      this.usersoverviewChart.plotOptions.pie.donut.labels.total.formatter = () => '4';
    } else if (this.selectedCard === 'webService') {
      this.usersoverviewChart.series = [4, 4];
      this.usersoverviewChart.labels = ['Activos', 'Inactivos'];
      this.usersoverviewChart.plotOptions.pie.donut.labels.total.label = ' Usuarios WebService';
      this.usersoverviewChart.plotOptions.pie.donut.labels.total.formatter = () => '8';
    } else if (this.selectedCard === 'pendingRequests') {
      this.usersoverviewChart.series = [2, 4];
      this.usersoverviewChart.labels = ['Aprobadas', 'Rechazadas'];
      this.usersoverviewChart.plotOptions.pie.donut.labels.total.label = 'Solicitudes pendientes';
      this.usersoverviewChart.plotOptions.pie.donut.labels.total.formatter = () => '6';
    }
    if (this.chart) {
      this.chart.updateOptions(this.usersoverviewChart);
    }
  }
}
