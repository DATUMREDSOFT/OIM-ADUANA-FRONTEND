import { Component, ViewChild, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';
import { MatAccordion } from '@angular/material/expansion';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-solicitud-interno',
  templateUrl: './solicitud-interno.component.html',
  standalone: true,
  providers: [DatePipe],
  imports: [MaterialModule, MatCardModule, FormsModule, ReactiveFormsModule, CommonModule, MatNativeDateModule, MatExpansionModule, TablerIconsModule],
})
export class AppSolicitudInternoComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

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

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe) {}

  ngOnInit() {
    this.userForm = this._formBuilder.group({
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
    });
    this.userRequests = [
      {
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
      },
    ];
  }

  private resetFields(fields: string[]) {
    const resetValues = fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {});
    this.userForm.patchValue(resetValues);
  }

  onSolicitudChange(event: any) {
    // Handle the change in solicitud type if needed
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

  validateField(fieldName: string) {
    const field = this.userForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      field.markAsTouched();
    }
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

  addProfileAndSystem() {
    const perfil = this.userForm.value.perfil;
    const aduanaPerfil = this.userForm.value.aduanaPerfil;
    const fechaInicioPerfil = this.datePipe.transform(this.userForm.value.fechaInicioPerfil, 'dd/MM/yyyy');
    const fechaFinPerfil = this.datePipe.transform(this.userForm.value.fechaFinPerfil, 'dd/MM/yyyy');

    if (perfil && aduanaPerfil && fechaInicioPerfil && fechaFinPerfil) {
      this.perfilesAsignados.push({ perfil, aduana: aduanaPerfil, fechaInicio: fechaInicioPerfil, fechaFin: fechaFinPerfil });
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
      this.sistemasAsignados.push({ sistema, aduana: aduanaSistema, fechaInicio: fechaInicioSistema, fechaFin: fechaFinSistema });
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
      tipoSolicitud: this.selectedSolicitud
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

  addAnotherUser() {
    if (!this.selectedSolicitud) {
      Swal.fire('Error', 'Debe seleccionar un tipo de solicitud', 'error');
      return;
    }

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
      tipoSolicitud: this.selectedSolicitud
    });
    this.userForm.reset();
    this.perfilesAsignados = [];
    this.sistemasAsignados = [];
    this.editMode = false;
    this.editType = null;
    this.buttonText = 'Guardar perfil y sistema';
  }

  editUser(index: number) {
    this.editIndex = index;
    const user = this.userRequests[index];
    this.userForm.patchValue({
      duiNit: user.duiNit,
      nombre: user.nombre,
      apellido: user.apellido,
      usuario: user.usuario,
      correo: user.correo,
      organizacion: user.organizacion,
      estado: user.estado,
      rol: user.rol,
      cargo: user.cargo,
    });
    this.perfilesAsignados = user.perfiles;
    this.sistemasAsignados = user.sistemas;

    // Populate the last profile and system in the userForm
    if (user.perfiles.length > 0) {
      const lastPerfil = user.perfiles[user.perfiles.length - 1];
      this.userForm.patchValue({
        perfil: lastPerfil.perfil,
        aduanaPerfil: lastPerfil.aduana,
        fechaInicioPerfil: lastPerfil.fechaInicio,
        fechaFinPerfil: lastPerfil.fechaFin,
      });
    }

    if (user.sistemas.length > 0) {
      const lastSistema = user.sistemas[user.sistemas.length - 1];
      this.userForm.patchValue({
        sistema: lastSistema.sistema,
        aduanaSistema: lastSistema.aduana,
        fechaInicioSistema: lastSistema.fechaInicio,
        fechaFinSistema: lastSistema.fechaFin,
      });
    }
  }

  confirmDeleteUser(index: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'No podrá revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(index);
        Swal.fire('Borrado', 'El usuario ha sido borrado', 'success');
      }
    });
  }

  deleteUser(index: number) {
    this.userRequests.splice(index, 1);
  }

  sendRequest() {
    if (this.userRequests.length === 0) {
      Swal.fire('Error', 'Debe agregar al menos un usuario', 'error');
      return;
    }

    // Logic to send the request
  }

  handleAccordionClose(index: number) {
    // Save the current user data when the accordion is closed
    this.saveCurrentUser();
  }

  editPerfil(index: number) {
    const perfil = this.perfilesAsignados[index];
    this.userForm.patchValue({
      perfil: perfil.perfil,
      aduanaPerfil: perfil.aduana,
      fechaInicioPerfil: perfil.fechaInicio,
      fechaFinPerfil: perfil.fechaFin,
    });
    this.editMode = true;
    this.editType = 'perfil';
    this.buttonText = 'Actualizar perfil';
    this.disableSistemaFields();
    this.scrollToForm();
  }

  editSistema(index: number) {
    const sistema = this.sistemasAsignados[index];
    this.userForm.patchValue({
      sistema: sistema.sistema,
      aduanaSistema: sistema.aduana,
      fechaInicioSistema: sistema.fechaInicio,
      fechaFinSistema: sistema.fechaFin,
    });
    this.editMode = true;
    this.editType = 'sistema';
    this.buttonText = 'Actualizar sistema';
    this.disablePerfilFields();
    this.scrollToForm();
  }

  updatePerfil() {
    const perfil = this.userForm.value.perfil;
    const aduanaPerfil = this.userForm.value.aduanaPerfil;
    const fechaInicioPerfil = this.datePipe.transform(this.userForm.value.fechaInicioPerfil, 'dd/MM/yyyy');
    const fechaFinPerfil = this.datePipe.transform(this.userForm.value.fechaFinPerfil, 'dd/MM/yyyy');

    if (perfil && aduanaPerfil && fechaInicioPerfil && fechaFinPerfil) {
      const index = this.perfilesAsignados.findIndex(p => p.perfil === perfil && p.aduana === aduanaPerfil);
      if (index !== -1) {
        this.perfilesAsignados[index] = { perfil, aduana: aduanaPerfil, fechaInicio: fechaInicioPerfil, fechaFin: fechaFinPerfil };
        Swal.fire('Éxito', 'Perfil actualizado', 'success').then(() => {
          // Reset the perfil fields
          this.userForm.patchValue({
            perfil: '',
            aduanaPerfil: '',
            fechaInicioPerfil: '',
            fechaFinPerfil: ''
          });
          this.editMode = false;
          this.editType = null;
          this.buttonText = 'Guardar perfil';
          this.enableAllFields();
        });
      }
    }
  }

  updateSistema() {
    const sistema = this.userForm.value.sistema;
    const aduanaSistema = this.userForm.value.aduanaSistema;
    const fechaInicioSistema = this.datePipe.transform(this.userForm.value.fechaInicioSistema, 'dd/MM/yyyy');
    const fechaFinSistema = this.datePipe.transform(this.userForm.value.fechaFinSistema, 'dd/MM/yyyy');

    if (sistema && aduanaSistema && fechaInicioSistema && fechaFinSistema) {
      const index = this.sistemasAsignados.findIndex(s => s.sistema === sistema && s.aduana === aduanaSistema);
      if (index !== -1) {
        this.sistemasAsignados[index] = { sistema, aduana: aduanaSistema, fechaInicio: fechaInicioSistema, fechaFin: fechaFinSistema };
        Swal.fire('Éxito', 'Sistema actualizado', 'success').then(() => {
          // Reset the sistema fields
          this.userForm.patchValue({
            sistema: '',
            aduanaSistema: '',
            fechaInicioSistema: '',
            fechaFinSistema: ''
          });
          this.editMode = false;
          this.editType = null;
          this.buttonText = 'Guardar sistema';
          this.enableAllFields();
        });
      }
    }
  }

  deletePerfil(index: number) {
    this.perfilesAsignados.splice(index, 1);
  }

  deleteSistema(index: number) {
    this.sistemasAsignados.splice(index, 1);
  }

  disablePerfilFields() {
    this.userForm.get('perfil')?.disable();
    this.userForm.get('aduanaPerfil')?.disable();
    this.userForm.get('fechaInicioPerfil')?.disable();
    this.userForm.get('fechaFinPerfil')?.disable();

    this.userForm.get('sistema')?.enable();
    this.userForm.get('aduanaSistema')?.enable();
    this.userForm.get('fechaInicioSistema')?.enable();
    this.userForm.get('fechaFinSistema')?.enable();
  }

  disableSistemaFields() {
    this.userForm.get('perfil')?.enable();
    this.userForm.get('aduanaPerfil')?.enable();
    this.userForm.get('fechaInicioPerfil')?.enable();
    this.userForm.get('fechaFinPerfil')?.enable();

    this.userForm.get('sistema')?.disable();
    this.userForm.get('aduanaSistema')?.disable();
    this.userForm.get('fechaInicioSistema')?.disable();
    this.userForm.get('fechaFinSistema')?.disable();
  }

  enableAllFields() {
    this.userForm.get('perfil')?.enable();
    this.userForm.get('aduanaPerfil')?.enable();
    this.userForm.get('fechaInicioPerfil')?.enable();
    this.userForm.get('fechaFinPerfil')?.enable();

    this.userForm.get('sistema')?.enable();
    this.userForm.get('aduanaSistema')?.enable();
    this.userForm.get('fechaInicioSistema')?.enable();
    this.userForm.get('fechaFinSistema')?.enable();
  }

  scrollToForm() {
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
