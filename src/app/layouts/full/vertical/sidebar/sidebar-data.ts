import { NavItem } from './nav-item/nav-item';

export const navItemsByUserType: { [key: string]: NavItem[] } = {
  NOAFPA: [
    {
      navCap: 'Menu principal',
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
      navCap: 'Menu principal',
    },
    {
      displayName: 'Dashboard AFPA',
      iconName: 'dashboard',
      action: () => {
        window.location.reload();
      },
      route: '/dashboards/dashboard-afpa',
    },
    {
      displayName: 'Solicitudes AFPA',
      iconName: 'file',
      route: '/dashboards/solicitudes-afpa',
    },
  ],
  INTERNO: [
    {
      navCap: 'Menu principal',
    },
    {
      displayName: 'Dashboard Interno',
      iconName: 'dashboard',
      action: () => {
        window.location.reload();
      },
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
