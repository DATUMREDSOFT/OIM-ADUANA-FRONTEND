import { Component } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';


// components
import { AppTopCardsInternoComponent } from '../../../components/dashboard1/top-cards-interno/top-cards-interno.component';
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
import { AppUsersOverviewComponent } from 'src/app/components/dashboard2/users-overview/users-overview.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-interno',
  standalone: true,
  imports: [
    CommonModule,
    TablerIconsModule,
    AppTopCardsInternoComponent,
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
    AppBasicTableComponent,
    AppUsersTable,
    AppWebUsersTable,
    AppUsersOverviewComponent,
    MatCardModule
  ],
  templateUrl: './dashboard-interno.component.html',
})
export class AppDashboardInternoComponent {
  selectedCard: string | null = null;

  onCardClick(cardType: string) {
    this.selectedCard = cardType;
  }
}
