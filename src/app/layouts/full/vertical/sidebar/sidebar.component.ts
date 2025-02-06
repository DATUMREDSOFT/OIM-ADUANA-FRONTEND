import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { navItemsByUserType, defaultNavItems } from './sidebar-data';
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
  @Input() navItems = defaultNavItems;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.loadMenuItems();
    });
    this.loadMenuItems(); // Load the correct menu on initial render
  }

  private loadMenuItems() {
    const userType = JSON.parse(localStorage.getItem('tipo-usuario') || '{}').value;
    this.navItems = navItemsByUserType[userType] || defaultNavItems;
    this.cdr.detectChanges(); // Ensure UI updates correctly
  }
}
