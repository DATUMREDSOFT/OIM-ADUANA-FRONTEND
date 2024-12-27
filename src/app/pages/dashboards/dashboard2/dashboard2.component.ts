import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RequestService, Request } from './request.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';


// components
import { AppWelcomeCardComponent } from '../../../components/dashboard2/welcome-card/welcome-card.component';
import { AppPaymentsComponent } from '../../../components/dashboard2/payments/payments.component';
import { AppProductsComponent } from '../../../components/dashboard2/products/products.component';
import { AppRevenueUpdatesTwoComponent } from '../../../components/dashboard2/revenue-updates/revenue-updates.component';
import { AppSalesOverviewComponent } from '../../../components/dashboard2/sales-overview/sales-overview.component';
import { AppTotalEarningsComponent } from '../../../components/dashboard2/digitadores-bar/total-earnings.component';
import { AppSalesProfitComponent } from '../../../components/dashboard2/sales-profit/sales-profit.component';
import { AppMonthlyEarningsTwoComponent } from '../../../components/dashboard2/monthly-earnings/monthly-earnings.component';
import { AppWeeklyStatsComponent } from '../../../components/dashboard1/weekly-stats/weekly-stats.component';
import { AppYearlySalesComponent } from '../../../components/dashboard2/yearly-sales/yearly-sales.component';
import { AppPaymentGatewaysComponent } from '../../../components/dashboard2/payment-gateways/payment-gateways.component';
import { AppRecentTransactionsComponent } from '../../../components/dashboard2/recent-transactions/recent-transactions.component';
import { AppProductPerformanceComponent } from '../../../components/dashboard2/product-performance/product-performance.component';

@Component({
  selector: 'app-dashboard2',
  standalone: true,
  imports: [
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
    MatTabsModule,
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatButton
  ],
  templateUrl: './dashboard2.component.html',
  providers: [DatePipe]
})
export class AppDashboard2Component {
  drafts$ = this.requestService.drafts$;
  sentRequests$ = this.requestService.sentRequests$;

  constructor(private requestService: RequestService, private snackBar: MatSnackBar) {}

  saveAsDraft(reason: string) {
    const request: Request = {
      id: this.generateId(),
      reason,
      status: 'draft',
      date: new Date()
    };
    this.requestService.saveAsDraft(request);
    this.snackBar.open('La solicitud fue enviada a borradores', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  sendRequest(reason: string) {
    const request: Request = {
      id: this.generateId(),
      reason,
      status: 'sent',
      date: new Date()
    };
    this.requestService.sendRequest(request);
    const requestId = `DGA-${Math.floor(1000 + Math.random() * 9000)}`;
    this.snackBar.open(`Se ha enviado la solicitud con codigo ${requestId}`, 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
