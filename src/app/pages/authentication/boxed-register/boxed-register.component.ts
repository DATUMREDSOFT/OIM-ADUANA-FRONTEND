import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthHelperService } from 'src/app/services/auth-helper.service';
import { searchUser } from 'src/app/services/search-helper';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-boxed-register',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './boxed-register.component.html',
})
export class AppBoxedRegisterComponent implements OnInit {
  documentControl: FormControl;
  loading: boolean = false;
  searchAttempted: boolean = false;
  searchCompleted = false;

  constructor(
    private authHelperService: AuthHelperService,
    private router: Router
  ) {}

  ngOnInit() {
    this.documentControl = new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{8}-\d{1}$|^\d{4}-\d{6}-\d{3}-\d{1}$/),
    ]);
  }

  async onSearch() {
    this.searchAttempted = true;
    if (this.documentControl.invalid) {
      this.documentControl.markAsTouched();
      return;
    }
    this.loading = true;

    const documentNumber = this.documentControl.value.replace(/\D/g, '');

    searchUser(documentNumber, this.authHelperService).subscribe({
      next: (user) => {
        this.loading = false;
        if (!user) {
          this.showNotFoundToast();
          return;
        }

        // Debugging: Log the response
        console.log('User Response:', user);

        if (user.status === 200 || user.externalCodeDeclarant) {
          this.handleUserResponse(user);
        } else {
          this.showNotFoundToast();
        }
      },
      error: (err) => {
        this.loading = false;
        this.handleError(err);
      },
    });
  }

  private handleUserResponse(user: any): void {
    if (user.externalCodeDeclarant) {
      // User is an AgenteAFPA or similar role
      Swal.fire({
        title: 'Documento con acceso al sistema',
        text: 'Este usuario ya cuenta con acceso al sistema. ¿Desea iniciar sesión?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Cerrar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/authentication/boxed-login']);
        }
      });
    } else if (user.status === 200) {
      // User is an Elaborador or Aplicante
      this.router.navigate(['/external-interface']);
    } else {
      // Unknown response
      this.showNotFoundToast();
    }
  }

  private handleError(err: any): void {
    if (err.status !== 404) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: 'Ocurrió un error al validar el documento. Por favor, intente nuevamente.',
        confirmButtonText: 'Entendido',
      });
    }
  }

  private showNotFoundToast(): void {
    Swal.fire({
      icon: 'error',
      title: 'El documento no fue encontrado.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  }

  formatDocument() {
    let value = this.documentControl.value.replace(/\D/g, ''); // Remove non-digit characters

    if (value.length > 14) {
      value = value.substring(0, 14); // Limit to 14 digits
    }

    if (value.length <= 9) {
      // Format as DUI
      this.documentControl.setValue(value.replace(/(\d{8})(\d{1})/, '$1-$2'), { emitEvent: false });
    } else {
      // Format as NIT
      this.documentControl.setValue(value.replace(/(\d{4})(\d{6})(\d{3})(\d{1})/, '$1-$2-$3-$4'), { emitEvent: false });
    }
  }
}