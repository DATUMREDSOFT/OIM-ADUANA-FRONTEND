// boxed-register.component.ts
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { ApplicantService } from '../../../services/applicant.service';
import { TipoUsuarioService } from '../../../services/tipo-usuario.service';
import { TiposSolicitudService } from '../../../services/tipos-solicitud.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { EnvironmentService } from '../../../services/environment.service';
import { Solicitante } from '../boxed-register/models/solicitante.model';
import { TipoSolicitud } from './models/tipo-solicitud.model';
import { FormType } from '../../../enums/form-type.enum';
import { Roles } from '../../../enums/roles.enum';
import Swal from 'sweetalert2';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { CommonAttribute } from '../../../models/common-attribute.model';

@Component({
  selector: 'app-boxed-register',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './boxed-register.component.html',
})
export class AppBoxedRegisterComponent {
  private applicantService = inject(ApplicantService);
  private tipoUsuarioService = inject(TipoUsuarioService);
  private tiposSolicitudService = inject(TiposSolicitudService);
  private localStorageService = inject(LocalStorageService);
  private environment = inject(EnvironmentService);
  private router = inject(Router);

  @Output() continuar = new EventEmitter<void>();

  documentControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{8}-\d{1}$|^\d{4}-\d{6}-\d{3}-\d{1}$/)
  ]);

  loading = false;
  searchAttempted = false;
  searchCompleted = false;
  isRepresentativeLegal = false;
  applicantType = FormType.AgenteAFPA;
  currentApplicant: Solicitante | null = null;
  solicitanteAPI: Solicitante | null = null;
  representanteAPI: Solicitante | null = null;
  tipoSolicitante: TipoSolicitud | null = null;

  async onSearch() {
    this.searchAttempted = true;
    if (this.documentControl.invalid) return this.documentControl.markAsTouched();

    this.loading = true;
    const documentNumber = this.documentControl.value?.replace(/\D/g, '') || '';

    try {
      if (this.isRepresentativeLegal) {
        await this.handleRepresentativeSearch(documentNumber);
      } else {
        await this.handleIndividualSearch(documentNumber);
      }
    } catch (error) {
      this.handleSearchError(error);
    } finally {
      this.loading = false;
    }
  }

  private async handleIndividualSearch(documentNumber: string) {
    try {
      const applicant = await this.applicantService.fullValidationFlow(documentNumber)
        .pipe(
          map(applicant => this.enrichApplicantData(applicant)),
          catchError(error => {
            this.handleSearchError(error);
            return throwError(() => error);
          })
        )
        .toPromise();

      if (applicant) {
        if (applicant.name?.trim() !== 'null') {
          await this.processApplicant(applicant);
          this.storeInLocalStorage(applicant);
          await this.loadTiposSolicitud();
        } else {
          this.showUserNotFoundAlert();
        }
      }
    } catch (error) {
      this.handleSearchError(error);
    }
  }

  private enrichApplicantData(applicant: Solicitante): Solicitante {
    const document = applicant.document || this.documentControl.value?.replace(/\D/g, '') || '';
    
    return {
      attribute: applicant.attribute || { id: 'NA', status: 'ENABLED', value: 'N/A' },
      externalType: this.determineExternalTypeFromDoc(document),
      name: applicant.name || '',
      position: applicant.position || { id: 'NA', status: 'ENABLED', value: 'N/A' },
      document: document,
      mail: applicant.mail || '',
      externalCodeDeclarant: applicant.externalCodeDeclarant || ''
    };
  }
  
  private determineExternalTypeFromDoc(document: string): CommonAttribute {
    const docType = document?.length === 9 ? 'PERSONAL' : 
                   document?.length === 14 ? 'EMPRESAL' : 
                   'ADUANAL';
    
    return {
      id: docType,
      status: 'ENABLED',
      value: this.getTipoSolicitanteValue(docType)
    };
  }

  private getTipoSolicitanteValue(id: string): string {
    const tipos = [
      { id: 'PERSONAL', value: 'Persona Natural' },
      { id: 'EMPRESAL', value: 'Representante Legal' },
      { id: 'ADUANAL', value: 'Auxiliar de la función pública' }
    ];
    
    return tipos.find(t => t.id === id)?.value || 'N/A';
  }

  private async handleRepresentativeSearch(documentNumber: string) {
    const representativeDoc = ''; // Get from form
    try {
      const result = await this.applicantService
        .validateRepresentative(documentNumber, representativeDoc)
        .pipe(
          map(([applicant, representative]) => [
            this.enrichApplicantData(applicant),
            this.enrichApplicantData(representative)
          ])
        )
        .toPromise();

      if (result) {
        const [applicant, representative] = result;
        await this.processApplicant(applicant);
        this.processRepresentative(representative);
        this.storeInLocalStorage(applicant);
        await this.loadTiposSolicitud();
      }
    } catch (error) {
      this.handleSearchError(error);
    }
  }

  private processRepresentative(representative: Solicitante) {
    this.representanteAPI = representative;
    this.localStorageService.setItem(
      this.environment.localStorageRepresentanteKey,
      representative,
      this.environment.tiempoLocalStorage
    );
  }

  private async processApplicant(applicant: Solicitante) {
    // Check if the user is an internal user based on externalType
    if (applicant.externalType?.id === 'ADUANAL' || applicant.externalType?.id === 'EMPRESAL') {
      return this.handleInternalUser();
    }
    if (applicant.externalCodeDeclarant) return this.handleAfpaUser(applicant);
  
    this.currentApplicant = applicant;
    const formType = applicant.externalCodeDeclarant ? 
                    FormType.AgenteAFPA : 
                    FormType.PersonalNoAFPA;
    
    this.tipoUsuarioService.setTipoUsuario(formType);
    this.showSuccessAlert(applicant);
  }

  private async loadTiposSolicitud() {
    try {
      const tipoUsuario = this.tipoUsuarioService.getTipoUsuario();
      const tipo = tipoUsuario === Roles.AFPA ? 'AFPA' : 
                  tipoUsuario === Roles.INTERNO ? 'interno' : 'externo';
      
      const tipos = await this.applicantService.getTiposSolicitud(tipo)
        .pipe(
          map(response => response.sort((a, b) => a.id.localeCompare(b.id)))
        )
        .toPromise();

      if (tipos) {
        this.tiposSolicitudService.setData(tipos);
      }
    } catch (error) {
      console.error('Error loading request types:', error);
      Swal.fire('Error', 'No se pudieron cargar los tipos de solicitud', 'error');
    }
  }

  private handleInternalUser() {
    this.showLoginPrompt('Eres un usuario interno, inicia sesión para continuar.');
  }

  private handleAfpaUser(applicant: Solicitante) {
    this.showLoginPrompt('Eres un usuario AFPA, inicia sesión para continuar.', true);
  }

  private showSuccessAlert(applicant: Solicitante) {
    // Determine user type from externalType
    const userType = applicant.externalType?.id;
  
    // Set the correct dashboard route
    let dashboardRoute = '/dashboards/dashboard-externo'; // Default to external dashboard
  
    if (userType === 'ADUANAL' || userType === 'EMPRESAL') {
      dashboardRoute = '/dashboards/dashboard-interno';
    } else if (applicant.externalCodeDeclarant) {
      dashboardRoute = '/dashboards/dashboard-afpa'; // Assuming AFPA also redirects here
    }
  
    // Store user info in localStorage
    this.storeInLocalStorage(applicant);
  
    // Redirect user to the correct dashboard
    this.router.navigate([dashboardRoute]);
  }
  

  private showLoginPrompt(message: string, isAfpa = false) {
    Swal.fire({
      title: 'Acceso existente',
      text: message,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Iniciar sesión',
      cancelButtonText: 'Cerrar'
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate([isAfpa ? '/external-interface' : '/authentication/boxed-login']);
      }
    });
  }

  private showUserNotFoundAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Usuario no encontrado',
      text: 'El documento proporcionado no está registrado en el sistema',
      confirmButtonText: 'Entendido'
    });
  }

  private handleSearchError(error: any) {
    if (error.status === 404) {
      this.showUserNotFoundAlert();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error del servidor',
        text: 'Ocurrió un error al procesar su solicitud',
        confirmButtonText: 'Reintentar'
      });
    }
  }

  private storeInLocalStorage(applicant: Solicitante) {
    const storageItem = {
      value: {
        attribute: applicant.attribute,
        externalType: applicant.externalType,
        name: applicant.name,
        externalCodeDeclarant: applicant.externalCodeDeclarant,
        position: applicant.position,
        document: applicant.document,
        mail: applicant.mail
      },
      expirationDate: new Date(
        Date.now() + this.environment.tiempoLocalStorage * 60000
      ).toISOString()
    };
  
    this.localStorageService.setItem(
      this.environment.localStorageSolicitanteKey,
      storageItem,
      this.environment.tiempoLocalStorage
    );
  }

  formatDocument() {
    let value = (this.documentControl.value || '').replace(/\D/g, '');
    if (value.length > 14) value = value.substring(0, 14);

    if (value.length <= 9) {
      this.documentControl.setValue(value.replace(/(\d{8})(\d{1})/, '$1-$2'), { emitEvent: false });
    } else {
      this.documentControl.setValue(value.replace(/(\d{4})(\d{6})(\d{3})(\d{1})/, '$1-$2-$3-$4'), { emitEvent: false });
    }
  }
}