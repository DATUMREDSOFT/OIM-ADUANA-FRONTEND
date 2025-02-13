import {Routes} from '@angular/router';
import {AuthGuard} from 'src/app/guards/auth.guard';

// dashboards
import {AppDashboardInternoComponent} from './dasboard-interno/dashboard-interno.component';
import {AppDashboardAfpaComponent} from './dashboard-afpa/dashboard-afpa.component';
import {AppDashboardExternoComponent} from './dashboard_externo/dashboard-externo.component';
import {AppSolicitudAfpaComponent} from './solicitud-nuevo-afpa/solicitud-afpa.component';
import {AppSolicitudBaseComponent} from './solicitud-base/solicitud-base.component';
import {AprobacionesComponent} from "./aprobaciones/aprobaciones.component";


export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard-interno',
        component: AppDashboardInternoComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'INTERNO',
          title: 'Analytical',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard-interno'},
            {title: 'Analytical'},
          ],
        },
      },
      {
        path: 'dashboard-afpa',
        component: AppDashboardAfpaComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'AFPA',
          title: 'Analytical',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard-afpa'},
            {title: 'Analytical'},
          ],
        },
      },
      {
        path: 'dashboard-externo',
        component: AppDashboardExternoComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'NOAFPA',
          title: 'Analytical',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard-externo'},
            {title: 'Analytical'},
          ],
        },
      },
      {
        path: 'solicitudes-interno',
        component: AppSolicitudBaseComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'INTERNO',
          title: 'Solicitudes',
          urls: [
            {title: 'Dashboard', url: '/dashboards/solicitudes-interno'},
            {title: 'Analytical'},
          ],
        },
      },
      {
        path: 'solicitudes-afpa',
        component: AppSolicitudBaseComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'AFPA',
          title: 'Analytical',
          urls: [
            {title: 'Dashboard', url: '/dashboards/solicitudes-afpa'},
            {title: 'Analytical'},
          ],
        },
      },
      {
        path: 'solicitudes-externo',
        component: AppSolicitudBaseComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'NOAFPA',
          title: 'Analytical',
          urls: [
            {title: 'Dashboard', url: '/dashboards/solicitudes-externo'},
            {title: 'Analytical'},
          ],
        },
      },
      {
        path: 'aprobaciones',
        component: AprobacionesComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'INTERNO',
          title: 'Analytical',
          urls: [
            {title: 'Dashboard', url: '/dashboards/aprobaciones'},
            {title: 'Analytical'},
          ],
        },

      }
    ],
  },
];
