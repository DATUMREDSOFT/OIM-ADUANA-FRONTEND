import {Component, ViewChild, OnInit} from '@angular/core';
// import { MatStepper } from '@angular/material/stepper';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material.module';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {MatNativeDateModule} from '@angular/material/core';
import Swal from 'sweetalert2';
import {MatAccordion} from '@angular/material/expansion';
import {MatExpansionModule} from '@angular/material/expansion';
import {DatePipe} from '@angular/common';

// icons
import {TablerIconsModule} from 'angular-tabler-icons';
import {FormServiceService} from "../../../services/form-service.service";

@Component({
  selector: 'app-solicitud-externo',
  templateUrl: './solicitud-externo.component.html',
  standalone: true,
  providers: [DatePipe],
  imports: [MaterialModule, MatCardModule, FormsModule, ReactiveFormsModule, CommonModule, MatNativeDateModule, MatExpansionModule, TablerIconsModule],
})
export class AppSolicitudExternoComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  formGroup: FormGroup;
  userForm: FormGroup;
  userRequests: any[] = [];
  perfilesAsignados: any[] = [];
  sistemasAsignados: any[] = [];
  currentUser: any = null;
  editIndex: number | null = null;
  editMode: boolean = false;
  editType: 'perfil' | 'sistema' | null = null;
  buttonText: string = 'Guardar perfil y sistema';

  selectedSolicitud: string = '';
  isLoading: boolean = false;
  shouldSave: boolean = false;

  constructor(private fb: FormBuilder, private datePipe: DatePipe, private formService: FormServiceService) {
  }

  ngOnInit() {
    // this.formGroup = this.fb.group({
    //   nombre: ['', Validators.required],
    //   apellido: ['', Validators.required],
    //   correo: ['', [Validators.required, Validators.email]],
    //   telefono: ['', Validators.required],
    //   organizacion: [{value: 'DGA', disabled: true}],
    //   estado: ['', Validators.required],
    //   tipo: ['', Validators.required],
    //   accesos: [{value: 'SIAPA', disabled: true}],
    //   perfil: [''],
    //   aduanaPerfil: [''],
    //   correoAlternativo: ['', Validators.required],
    //   movil: ['', Validators.required],
    //
    // });

    this.formGroup = this.formService.getForm();


  }

  editPerfil(index: number) {
    this.editMode = true;
    this.editType = 'perfil';
    this.editIndex = index;
    const perfil = this.perfilesAsignados[index];
    this.userForm.patchValue({
      perfil: perfil.perfil,
      aduanaPerfil: perfil.aduana,
      fechaInicioPerfil: perfil.fechaInicio,
      fechaFinPerfil: perfil.fechaFin
    });
  }

  editSistema(index: number) {
    this.editMode = true;
    this.editType = 'sistema';
    this.editIndex = index;
    const sistema = this.sistemasAsignados[index];
    this.userForm.patchValue({
      sistema: sistema.sistema,
      aduanaSistema: sistema.aduana,
      fechaInicioSistema: sistema.fechaInicio,
      fechaFinSistema: sistema.fechaFin
    });
  }

  deletePerfil(index: number) {
    this.perfilesAsignados.splice(index, 1);
    Swal.fire('Éxito', 'Perfil eliminado', 'success');
  }

  deleteSistema(index: number) {
    this.sistemasAsignados.splice(index, 1);
    Swal.fire('Éxito', 'Sistema eliminado', 'success');
  }

  onSolicitudChange(event: any, index: number) {
    const selectedType = event.value;
    this.userRequests[index].tipoSolicitud = selectedType;
  }

  fetchUserData() {
    // Mock data for now
    this.userForm.patchValue({
      nombre: 'John',
      apellido: 'Doe',
      usuario: 'jdoe',
      correo: 'jdoe@example.com',
      estado: 'Activo',
    });
  }

  addAnotherForm() {
    this.userRequests.push({
      duiNit: '',
      nombre: '',
      apellido: '',
      usuario: '',
      correo: '',
      organizacion: 'DGA',
      estado: '',
      rol: '',
      cargo: '',
      perfiles: [],
      sistemas: [],
      tipoSolicitud: ''
    });
  }

  deleteForm(index: number) {
    this.userRequests.splice(index, 1);
  }

  saveProfileAndSystem() {
    if (this.editMode) {
      if (this.editType === 'perfil') {
        this.updatePerfil();
      } else if (this.editType === 'sistema') {
        this.updateSistema();
      }
    } else {
      this.addProfileAndSystem();
    }
  }

  updatePerfil() {
    // Implement the logic to update the perfil
    const perfil = this.userForm.value.perfil;
    const aduanaPerfil = this.userForm.value.aduanaPerfil;
    const fechaInicioPerfil = this.datePipe.transform(this.userForm.value.fechaInicioPerfil, 'dd/MM/yyyy');
    const fechaFinPerfil = this.datePipe.transform(this.userForm.value.fechaFinPerfil, 'dd/MM/yyyy');

    if (perfil && aduanaPerfil && fechaInicioPerfil && fechaFinPerfil) {
      if (this.editIndex !== null) {
        this.perfilesAsignados[this.editIndex] = {
          perfil,
          aduana: aduanaPerfil,
          fechaInicio: fechaInicioPerfil,
          fechaFin: fechaFinPerfil
        };
      }
      Swal.fire('Éxito', 'Perfil actualizado', 'success').then(() => {
        // Reset the perfil fields
        this.userForm.patchValue({
          perfil: '',
          aduanaPerfil: '',
          fechaInicioPerfil: '',
          fechaFinPerfil: ''
        });
      });
    }
  }

  updateSistema() {
    // Implement the logic to update the sistema
    const sistema = this.userForm.value.sistema;
    const aduanaSistema = this.userForm.value.aduanaSistema;
    const fechaInicioSistema = this.datePipe.transform(this.userForm.value.fechaInicioSistema, 'dd/MM/yyyy');
    const fechaFinSistema = this.datePipe.transform(this.userForm.value.fechaFinSistema, 'dd/MM/yyyy');

    if (sistema && aduanaSistema && fechaInicioSistema && fechaFinSistema) {
      if (this.editIndex !== null) {
        this.sistemasAsignados[this.editIndex] = {
          sistema,
          aduana: aduanaSistema,
          fechaInicio: fechaInicioSistema,
          fechaFin: fechaFinSistema
        };
      }
      Swal.fire('Éxito', 'Sistema actualizado', 'success').then(() => {
        // Reset the sistema fields
        this.userForm.patchValue({
          sistema: '',
          aduanaSistema: '',
          fechaInicioSistema: '',
          fechaFinSistema: ''
        });
      });
    }
  }


  addProfileAndSystem() {
    const perfil = this.userForm.value.perfil;
    const aduanaPerfil = this.userForm.value.aduanaPerfil;
    const fechaInicioPerfil = this.datePipe.transform(this.userForm.value.fechaInicioPerfil, 'dd/MM/yyyy');
    const fechaFinPerfil = this.datePipe.transform(this.userForm.value.fechaFinPerfil, 'dd/MM/yyyy');

    if (perfil && aduanaPerfil && fechaInicioPerfil && fechaFinPerfil) {
      this.perfilesAsignados.push({
        perfil,
        aduana: aduanaPerfil,
        fechaInicio: fechaInicioPerfil,
        fechaFin: fechaFinPerfil
      });
      Swal.fire('Éxito', 'Se asignó perfil a usuario', 'success').then(() => {
        // Reset the perfil fields
        this.userForm.patchValue({
          perfil: '',
          aduanaPerfil: '',
          fechaInicioPerfil: '',
          fechaFinPerfil: ''
        });
      });
    }

    const sistema = this.userForm.value.sistema;
    const aduanaSistema = this.userForm.value.aduanaSistema;
    const fechaInicioSistema = this.datePipe.transform(this.userForm.value.fechaInicioSistema, 'dd/MM/yyyy');
    const fechaFinSistema = this.datePipe.transform(this.userForm.value.fechaFinSistema, 'dd/MM/yyyy');

    if (sistema && aduanaSistema && fechaInicioSistema && fechaFinSistema) {
      this.sistemasAsignados.push({
        sistema,
        aduana: aduanaSistema,
        fechaInicio: fechaInicioSistema,
        fechaFin: fechaFinSistema
      });
      Swal.fire('Éxito', 'Se asignó sistema a usuario', 'success').then(() => {
        // Reset the sistema fields
        this.userForm.patchValue({
          sistema: '',
          aduanaSistema: '',
          fechaInicioSistema: '',
          fechaFinSistema: ''
        });
      });
    }
  }

  saveCurrentUser() {
    if (this.userForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    this.currentUser = {
      duiNit: this.userForm.get('duiNit')?.value,
      nombre: this.userForm.get('nombre')?.value,
      apellido: this.userForm.get('apellido')?.value,
      usuario: this.userForm.get('usuario')?.value,
      correo: this.userForm.get('correo')?.value,
      organizacion: this.userForm.get('organizacion')?.value,
      estado: this.userForm.get('estado')?.value,
      rol: this.userForm.get('rol')?.value,
      cargo: this.userForm.get('cargo')?.value,
      perfiles: this.perfilesAsignados,
      sistemas: this.sistemasAsignados,
      tipoSolicitud: this.userForm.get('tipoSolicitud')?.value
    };

    if (this.editIndex !== null) {
      this.userRequests[this.editIndex] = this.currentUser;
      this.editIndex = null;
    } else {
      this.userRequests.push(this.currentUser);
    }

    this.currentUser = null;
    this.userForm.reset();
    this.perfilesAsignados = [];
    this.sistemasAsignados = [];
    this.editMode = false;
    this.editType = null;
    this.buttonText = 'Guardar perfil y sistema';
  }

  scrollToForm(index: number) {
    const formElement = document.querySelector(`#form-${index}`);
    if (formElement) {
      formElement.scrollIntoView({behavior: 'smooth'});
    }
  }

  sendRequest() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      Swal.fire('Éxito', 'Solicitud enviada', 'success');
    }, 3000);
  }
}
