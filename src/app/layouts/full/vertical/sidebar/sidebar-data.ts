import { NavItem } from './nav-item/nav-item';

export const navItemsByUserType: { [key: string]: NavItem[] } = {
  NOAFPA: [
    {
      navCap: 'Home',
    },
    {
      displayName: 'Principal',
      iconName: 'home',
      action: () => {
        window.location.reload();
      },
      route: '/dashboards/dashboard-externo',
    },
    {
      displayName: 'Solicitudes',
      iconName: 'file',
      route: '/dashboards/solicitudes-externo',
    },
  ],
  AFPA: [
    {
      navCap: 'Dashboard',
    },
    {
      displayName: 'Dashboard Interno',
      iconName: 'dashboard',
      route: '/dashboards/dashboard-interno',
    },
    {
      displayName: 'Solicitudes Interno',
      iconName: 'file',
      route: '/dashboards/solicitudes-interno',
    },
    {
      displayName: 'Nuevo AFPA',
      iconName: 'person-add',
      route: '/dashboards/solicitud-nuevo-afpa',
    },
  ],
  INTERNO: [
    {
      navCap: 'Dashboard',
    },
    {
      displayName: 'Dashboard Interno',
      iconName: 'dashboard',
      route: '/dashboards/dashboard-interno',
    },
    {
      displayName: 'Solicitudes Interno',
      iconName: 'file',
      route: '/dashboards/solicitudes-interno',
    },
  ],
};

// Default menu if user type is unknown
export const defaultNavItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Principal',
    iconName: 'home',
    route: '/dashboards/dashboard1',
  },
  {
    displayName: 'Solicitudes Interno',
    iconName: 'file',
    route: '/dashboards/solicitudes-interno',
  },
];
