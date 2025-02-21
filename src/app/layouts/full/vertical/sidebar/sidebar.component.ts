import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { navItemsByUserType, defaultNavItems } from './sidebar-data';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';

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
  menuItems: any[] = [];
  userType: string = '';

  constructor(@Inject(LocalStorageService) private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadUserType();
  }

  private loadUserType(): void {
    if (!this.localStorageService || typeof this.localStorageService.getItem !== 'function') {
      return;
    }

    const storedUser = this.localStorageService.getItem('tipo-usuario') as { value?: string } | null;

    if (storedUser && storedUser.value) {
      this.userType = storedUser.value;
      this.loadMenu();
    }
  }

  private loadMenu(): void {
    this.menuItems = navItemsByUserType[this.userType] || defaultNavItems;
  }
}
