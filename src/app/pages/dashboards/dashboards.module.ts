import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { DashboardsRoutes } from './dashboards.routes';

import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { AppDashboard2Component } from './dashboard2/dashboard2.component';
import { AppDashboardInternoComponent } from './dashboard_interno/dashboard-interno.component';
import { AppSolicitudInternoComponent } from './solicitud-interno/solicitud-interno.component';
import { AppSolicitudAfpaComponent } from './solicitud-nuevo-afpa/solicitud-afpa.component';

@NgModule({
  imports: [
    RouterModule.forChild(DashboardsRoutes),
    AppDashboard1Component,
    AppDashboard2Component,
    AppDashboardInternoComponent,
    AppSolicitudInternoComponent,
    AppSolicitudAfpaComponent,
  ],

})
export class DashboardsModule {}
