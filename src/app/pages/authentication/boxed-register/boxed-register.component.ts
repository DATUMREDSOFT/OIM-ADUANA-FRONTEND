import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatDialog } from '@angular/material/dialog';
import { AppDeleteRegistryComponent } from '../boxed-register/delete/delete.component';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-boxed-register',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './boxed-register.component.html',
})
export class AppBoxedRegisterComponent {
  documentControl: FormControl;
  loading: boolean = false;
  searchCompleted: boolean = false;
  userExists: boolean = false;
  userData: any = {};
  userType: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.documentControl = new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{8}-\d{1}$|^\d{4}-\d{6}-\d{3}-\d{1}$/)
    ]);
  }

  onSearch() {
    if (this.documentControl.invalid) {
      this.documentControl.markAsTouched();
      return;
    }
    this.loading = true;
    this.authService.validateDocument(this.documentControl.value).subscribe(
      (response) => {
        this.loading = false;
        this.searchCompleted = true;
        this.userExists = response.exists;
        this.userData = response.data;
        if (this.userExists) {
          Swal.fire({
            icon: 'success',
            title: 'Documento encontrado',
            text: 'El documento ha sido validado exitosamente.',
            confirmButtonText: 'Continuar'
          }).then(() => {
            this.router.navigate(['/solicitud-base'], { queryParams: { userType: 'externo', userData: JSON.stringify(this.userData) } });
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Documento no encontrado',
            text: 'No se encontraron datos para el documento ingresado.',
          });
        }
      },
      (error) => {
        this.loading = false;
        console.error('Document validation failed', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al validar el documento. Por favor, inténtelo de nuevo.',
        });
      }
    );
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


