import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

// dashboards
import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { AppDashboard2Component } from './dashboard2/dashboard2.component';
import { AppDashboardInternoComponent} from './dashboard_interno/dashboard-interno.component';
import { AppDashboardExternoComponent } from './dashboard_externo/dashboard-externo.component';
import { AppSolicitudAfpaComponent } from './solicitud-nuevo-afpa/solicitud-afpa.component';
import { AppSolicitudBaseComponent } from './solicitud-base/solicitud-base.component';
import { AppSolicitudExternoComponent } from './solicitud-externo/solicitud-externo.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard1',
        component: AppDashboard1Component,
        data: {
          title: 'Dashboard',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Analytical' },
          ],
        },
      },
      {
        path: 'dashboard2',
        component: AppDashboard2Component,
        data: {
          title: 'eCommerce',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard2' },
            { title: 'eCommerce' },
          ],
        },
      },
      {
        path:'dashboard-interno',
        component: AppDashboardInternoComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'INTERNO',
          title: 'Analytical',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard-interno' },
            { title: 'Analytical' },
          ],
        },
      },
      {
        path:'dashboard-externo',
        component: AppDashboardExternoComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'NOAFPA',
          title: 'Analytical',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard-externo' },
            { title: 'Analytical' },
          ],
        },
      },
      {
        path:'solicitudes-interno',
        component: AppSolicitudBaseComponent,
        data: {
          title: 'Solicitudes',
          urls: [
            { title: 'Dashboard', url: '/dashboards/solicitudes-interno' },
            { title: 'Analytical' },
          ],
        },
      },
      {
        path:'solicitud-nuevo-afpa',
        component: AppSolicitudAfpaComponent,
        data: {
          title: 'Analytical',
          urls: [
            { title: 'Dashboard', url: '/dashboards/solicitud-nuevo-afpa' },
            { title: 'Analytical' },
          ],
        },
      },
      {
        path:'solicitudes-externo',
        component: AppSolicitudBaseComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'NOAFPA',
          title: 'Analytical',
          urls: [
            { title: 'Dashboard', url: '/dashboards/solicitudes-externo' },
            { title: 'Analytical' },
          ],
        },
      }
    ],
  },
];
