import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { navItemsByUserType } from '../sidebar/sidebar-data';
import { TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import axios from 'axios';
import { Router } from '@angular/router';


interface profiledd {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  bienvenidaMessage: string = 'Bienvenido/a';
  userType: string = '';
  currentMenuOption: string = 'Dashboard'; // Default message
  fullName: string = 'Usuario';
  userFullName: string = 'Usuario';
  showDropdown: boolean = false;
  userTypeLabel: string = '';
  document: string = 'N/A';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Fetch user name from localStorage
    const solicitante = JSON.parse(localStorage.getItem('solicitante') || '{}')?.value?.value;
    const tipoUsuario = JSON.parse(localStorage.getItem('tipo-usuario') || '{}')?.value || 'Usuario';

    this.fullName = solicitante?.name || 'Usuario';
    this.userTypeLabel =
    tipoUsuario === 'NOAFPA'
      ? 'Usuario Externo'
      : tipoUsuario === 'AFPA'
      ? 'Usuario AFPA'
      : 'Usuario Interno';
    this.document = solicitante?.document || 'N/A';
  
    if (solicitante?.name) {
      const nameParts = solicitante.name.split(' ');
      if (nameParts.length >= 4) {
        // Take the first name and the second surname
        const [firstName, , secondSurname] = nameParts;
        this.userFullName = `${firstName} ${secondSurname}`;
      } else if (nameParts.length >= 2) {
        // Fallback if name doesn't have at least 4 parts
        const [firstName, firstSurname] = nameParts;
        this.userFullName = `${firstName} ${firstSurname}`;
      }
    }

    if (tipoUsuario === 'NOAFPA') {
      this.profiledd = [];
    }
  }

  
  

  /**
   * Update the header message when a menu option is clicked.
   */
  updateMenuOption(option: string): void {
    this.currentMenuOption = option;
  }

  /**
   * Toggle the dropdown menu visibility.
   */
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  /**
   * Handle logout: clear localStorage and redirect to login.
   */
  logout(): void {
    // Clear all localStorage and redirect
    localStorage.clear();
    this.router.navigate(['/authentication/boxed-register']);
  }

  profiledd: profiledd[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-account.svg',
      title: 'Mi perfil',
      subtitle: 'Configuracion de la cuenta',
      link: '/',
    },
  ];
}


