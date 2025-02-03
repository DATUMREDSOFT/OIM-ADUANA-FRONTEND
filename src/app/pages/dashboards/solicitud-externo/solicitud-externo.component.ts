import { Component, ViewChild, OnInit } from '@angular/core';
// import { MatStepper } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MaterialModule } from '../../../material.module';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';
import { MatAccordion } from '@angular/material/expansion';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-solicitud-externo',
  templateUrl: './solicitud-externo.component.html',
  standalone: true,
  providers: [DatePipe],
  imports: [MaterialModule, MatCardModule, FormsModule, ReactiveFormsModule, CommonModule, MatNativeDateModule, MatExpansionModule, TablerIconsModule],
})
export class AppSolicitudExternoComponent implements OnInit {
  documentControl: FormControl;
  formGroup: FormGroup;
  loading: boolean = false;
  searchCompleted: boolean = false;
  userExists: boolean = false;
  userData: any = {};
  userType: string = '';
  jwtHelper = new JwtHelperService();

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.documentControl = new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{8}-\d{1}$|^\d{4}-\d{6}-\d{3}-\d{1}$/)
    ]);

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.userType = decodedToken.userType || '';
    }
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
        if (this.userExists) {
          this.userData = response.data;
        } else {
          this.userData = {};
        }
      },
      (error) => {
        this.loading = false;
        console.error('Document validation failed', error);
      }
    );
  }

  fetchUserData() {
    return this.userData;
  }

  get subitems(): FormArray {
    return this.formGroup.get('subitems') as FormArray;
  }

  addSubitem() {
    const subitemGroup = this.fb.group({
      duiNit: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      usuario: ['', Validators.required],
      correo: ['', Validators.required],
      organizacion: [{ value: 'DGA', disabled: true }],
      estado: ['', Validators.required],
      rol: ['', Validators.required],
      cargo: ['', Validators.required],
      perfil: [''],
      aduanaPerfil: [''],
      fechaInicioPerfil: [''],
      fechaFinPerfil: [''],
      sistema: [''],
      aduanaSistema: [''],
      fechaInicioSistema: [''],
      fechaFinSistema: [''],
      tipoSolicitud: [''],
    });
    this.subitems.push(subitemGroup);
  }

  removeSubitem(index: number) {
    this.subitems.removeAt(index);
  }
}
