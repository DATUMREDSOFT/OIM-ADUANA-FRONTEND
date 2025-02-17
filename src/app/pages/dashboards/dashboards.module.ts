import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';


import {DashboardsRoutes} from './dashboards.routes';

import {AppDashboardAfpaComponent} from './dashboard-afpa/dashboard-afpa.component';
import {AppDashboardInternoComponent} from './dasboard-interno/dashboard-interno.component';
import {AppDashboardExternoComponent} from './dashboard_externo/dashboard-externo.component';
import {AppSolicitudBaseComponent} from './solicitud-base/solicitud-base.component';
import {AppSolicitudNuevoUsuarioComponent} from './solicitud-base/solicitud-nuevo-usuario/solicitud-nuevo-usuario.component';
import {AprobacionesComponent} from "./aprobaciones/aprobaciones/aprobaciones.component";
import {BaseAprobacionesComponent} from "./aprobaciones/base-aprobaciones.component";

@NgModule({
  imports: [
    RouterModule.forChild(DashboardsRoutes),
    AppDashboardAfpaComponent,
    AppDashboardInternoComponent,
    AppDashboardExternoComponent,
    AppSolicitudBaseComponent,
    AppSolicitudNuevoUsuarioComponent,
    BaseAprobacionesComponent
  ],

})
export class DashboardsModule {
}
