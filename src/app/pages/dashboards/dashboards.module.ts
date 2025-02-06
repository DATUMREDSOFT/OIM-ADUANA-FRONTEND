import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { DashboardsRoutes } from './dashboards.routes';

import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { AppDashboard2Component } from './dashboard2/dashboard2.component';
import { AppDashboardInternoComponent } from './dashboard_interno/dashboard-interno.component';
import { AppDashboardExternoComponent } from './dashboard_externo/dashboard-externo.component';
import { AppSolicitudInternoComponent } from './solicitud-interno/solicitud-interno.component';
import { AppSolicitudAfpaComponent } from './solicitud-nuevo-afpa/solicitud-afpa.component';
import { AppSolicitudBaseComponent } from './solicitud-base/solicitud-base.component';
import { AppSolicitudExternoComponent } from './solicitud-externo/solicitud-externo.component';

@NgModule({
  imports: [
    RouterModule.forChild(DashboardsRoutes),
    AppDashboard1Component,
    AppDashboard2Component,
    AppDashboardInternoComponent,
    AppSolicitudInternoComponent,
    AppDashboardExternoComponent,
    AppSolicitudAfpaComponent,
    AppSolicitudBaseComponent,
    AppSolicitudExternoComponent,
  ],

})
export class DashboardsModule {}
