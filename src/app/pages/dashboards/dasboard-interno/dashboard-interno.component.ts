import { Component, OnInit } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';

// components
import { AppWelcomeCardComponent } from '../../../components/dashboard2/welcome-card/welcome-card.component';
import { AppPaymentsComponent } from '../../../components/dashboard2/payments/payments.component';
import { AppRevenueUpdatesTwoComponent } from '../../../components/dashboard2/revenue-updates/revenue-updates.component';
import { AppSalesOverviewComponent } from '../../../components/dashboard2/sales-overview/sales-overview.component';
import { AppTotalEarningsComponent } from '../../../components/dashboard2/digitadores-bar/total-earnings.component';
import { AppSalesProfitComponent } from '../../../components/dashboard2/sales-profit/sales-profit.component';
import { AppMonthlyEarningsTwoComponent } from '../../../components/dashboard2/monthly-earnings/monthly-earnings.component';
import { AppYearlySalesComponent } from '../../../components/dashboard2/yearly-sales/yearly-sales.component';
import { AppPaymentGatewaysComponent } from '../../../components/dashboard2/payment-gateways/payment-gateways.component';
import { AppRecentTransactionsComponent } from '../../../components/dashboard2/recent-transactions/recent-transactions.component';
import { AppProductPerformanceComponent } from '../../../components/dashboard2/product-performance/product-performance.component';
import { AppTopCardsComponent } from '../../../components/dashboard1/top-cards/top-cards.component';
import { AppRevenueUpdatesComponent } from '../../../components/dashboard1/revenue-updates/revenue-updates.component';
import { AppYearlyBreakupComponent } from '../../../components/dashboard1/yearly-breakup/yearly-breakup.component';
import { AppMonthlyEarningsComponent } from '../../../components/dashboard1/monthly-earnings/monthly-earnings.component';
import { AppEmployeeSalaryComponent } from '../../../components/dashboard1/employee-salary/employee-salary.component';
import { AppCustomersComponent } from '../../../components/dashboard1/customers/customers.component';
import { AppProductsComponent } from '../../../components/dashboard2/products/products.component';
import { AppSocialCardComponent } from '../../../components/dashboard1/social-card/social-card.component';
import { AppSellingProductComponent } from '../../../components/dashboard1/selling-product/selling-product.component';
import { AppWeeklyStatsComponent } from '../../../components/dashboard1/weekly-stats/weekly-stats.component';
import { AppTopProjectsComponent } from '../../../components/dashboard1/top-projects/top-projects.component';
import { AppProjectsComponent } from '../../../components/dashboard1/projects/projects.component';
import { AppBasicTableComponent } from '../../tables/basic-table/basic-table.component';
import { AppUsersTable } from '../../apps/UsersTable/users-table.component';
import { AppWebUsersTable } from '../../apps/WebUsersTable/webusers-table.component';
import { AppWebServiceCardComponent } from 'src/app/components/dashboard2/webservice-card/webservice-card.component';
import { AppWebServiceBarComponent } from 'src/app/components/dashboard2/webservice-bar/webservice-bar.component';
import { AppUsersOverviewComponent } from 'src/app/components/dashboard2/users-overview/users-overview.component';
import { AppRequestStateComponent } from 'src/app/components/dashboard2/solicitudes-cards/estado-final/estado-final.component';
import { AppFinishedRequests } from 'src/app/components/dashboard2/solicitudes-cards/solicitudes-finalizadas/solicitudes-finalizadas.component';
import { AppNotStartedRequests } from 'src/app/components/dashboard2/solicitudes-cards/solicitudes-no-iniciadas/solicitudes-no-iniciadas.component';
import { AppPendingRequestsComponent } from 'src/app/components/dashboard2/solicitudes-cards/solicitudes-pendientes/solicitudes-pendientes.component';
import { MatCardModule } from '@angular/material/card';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard1',
  standalone: true,
  imports: [
    CommonModule,
    TablerIconsModule,
    AppTopCardsComponent,
    AppRevenueUpdatesComponent,
    AppYearlyBreakupComponent,
    AppMonthlyEarningsComponent,
    AppEmployeeSalaryComponent,
    AppCustomersComponent,
    AppProductsComponent,
    AppSocialCardComponent,
    AppSellingProductComponent,
    AppWeeklyStatsComponent,
    AppTopProjectsComponent,
    AppProjectsComponent,
    AppWelcomeCardComponent,
    AppPaymentsComponent,
    AppProductsComponent,
    AppRevenueUpdatesTwoComponent,
    AppSalesOverviewComponent,
    AppTotalEarningsComponent,
    AppSalesProfitComponent,
    AppMonthlyEarningsTwoComponent,
    AppWeeklyStatsComponent,
    AppYearlySalesComponent,
    AppPaymentGatewaysComponent,
    AppRecentTransactionsComponent,
    AppProductPerformanceComponent,
    AppBasicTableComponent,
    AppUsersTable,
    AppWebUsersTable,
    AppWebServiceCardComponent,
    AppUsersOverviewComponent,
    AppWebServiceBarComponent,
    AppRequestStateComponent,
    AppFinishedRequests,
    AppNotStartedRequests,
    AppPendingRequestsComponent,
    MatCardModule,
    NgApexchartsModule,
  ],
  templateUrl: './dashboard-interno.component.html',
})
export class AppDashboardInternoComponent implements OnInit {
  selectedCard: string | null = null;

  ngOnInit() {
    this.selectedCard = 'users';
  }

  onCardClick(cardType: string) {
    this.selectedCard = cardType;
  }
}
