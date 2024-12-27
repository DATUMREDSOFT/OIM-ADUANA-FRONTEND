import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { navItems as allNavItems } from './sidebar-data';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [BrandingComponent, TablerIconsModule, MaterialModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @Input() showToggle = true;
  @Input() navItems = allNavItems;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  isDashboardInterno = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      const navEndEvent = event as NavigationEnd;
      this.isDashboardInterno = navEndEvent.urlAfterRedirects.includes('dashboard-interno');
      this.filterNavItems();
    });
    this.filterNavItems(); // Ensure nav items are filtered on initial load
  }

  filterNavItems() {
    if (this.isDashboardInterno) {
      this.navItems = allNavItems.filter(item => 
        item.route === '/dashboards/dashboard-interno' || 
        item.route === '/solicitudes-interno'
      );
    } else {
      this.navItems = allNavItems.filter(item => 
        item.route !== '/dashboards/dashboard-interno' && 
        item.route !== '/solicitudes-interno'
      );
    }
    this.cdr.detectChanges(); // Ensure change detection is triggered
  }
}