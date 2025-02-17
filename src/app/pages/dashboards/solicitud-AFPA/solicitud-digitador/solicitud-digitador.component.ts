import {ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatAccordion} from "@angular/material/expansion";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {FormServiceService} from "../../../../services/form-service.service";
import Swal from "sweetalert2";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-solicitud-digitador',
  standalone: true,
  imports: [
    MatButton,
    MatCardContent,
    MatCardHeader,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatHint,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    ReactiveFormsModule,
    DatePipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatDivider,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable
  ],
  templateUrl: './solicitud-digitador.component.html',
})
export class SolicitudDigitadorComponent implements OnInit {


  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @Input() formGroup!: FormGroup;
  @Input() userIndex!: number; // Add this line to accept the index from the parent component
  userForm: FormGroup;
  userRequests: any[] = [];
  perfilesAsignados: any[] = [];
  sistemasAsignados: any[] = [];
  currentUser: any = null;
  editIndex: number | null = null;
  editMode: boolean = false;
  editType: 'perfil' | 'sistema' | null = null;


  selectedSolicitud: string = '';
  isLoading: boolean = false;
  shouldSave: boolean = false;

  displayedColumns: string[] = ['sistema', 'fechaInicioSistema', 'fechaFinSistema']; // Add this line
  dataSource = new MatTableDataSource(this.sistemasAsignados);

  constructor(private fb: FormBuilder, private datePipe: DatePipe, private formService: FormServiceService, private cdr: ChangeDetectorRef) {
    this.userForm = this.fb.group({
      sistema: ['', Validators.required],
      fechaInicioSistema: ['', Validators.required],
      fechaFinSistema: ['', Validators.required],

    });

  }

  ngOnInit() {
    if (!this.formGroup) {
      console.warn("❌ Warning: `formGroup` is undefined in `solicitud-externo.component.ts`.");
    } else {
      console.log("✅ Received `formGroup` on Init:", this.formGroup.value);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formGroup']?.currentValue) {
      console.log("✅ `formGroup` Updated:", changes['formGroup'].currentValue);
    }
    if (changes['userIndex']?.currentValue) {
      console.log("✅ `userIndex` Updated:", changes['userIndex'].currentValue);
    }
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

  asignarSistema() {
    const sistema = this.formGroup.get('sistema')?.value;
    const fechaInicioSistema = this.datePipe.transform(this.formGroup.get('fechaInicioSistema')?.value, 'MM/dd/yyyy');
    const fechaFinSistema = this.datePipe.transform(this.formGroup.get('fechaFinSistema')?.value, 'MM/dd/yyyy');

    console.log("Sistema:", sistema);
    console.log("Fecha Inicio Sistema:", fechaInicioSistema);
    console.log("Fecha Fin Sistema:", fechaFinSistema);

    if (sistema && fechaInicioSistema && fechaFinSistema) {
      this.sistemasAsignados.push({
        sistema: sistema,
        fechaInicioSistema: fechaInicioSistema,
        fechaFinSistema: fechaFinSistema
      });

      console.log("Sistemas Asignados:", this.sistemasAsignados);

      this.cdr.detectChanges();

      Swal.fire('Éxito', 'Sistema asignado al usuario', 'success');
    } else {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
    }
  }

  addProfileAndSystem() {
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

  updatePerfil() {
    // Implement the logic to update the perfil
    const perfil = this.userForm.value.perfil;
    const aduanaSistema = this.userForm.value.aduanaSistema;
    const fechaInicioPerfil = this.datePipe.transform(this.userForm.value.fechaInicioPerfil, 'dd/MM/yyyy');
    const fechaFinPerfil = this.datePipe.transform(this.userForm.value.fechaFinPerfil, 'dd/MM/yyyy');

    if (perfil && aduanaSistema && fechaInicioPerfil && fechaFinPerfil) {
      if (this.editIndex !== null) {
        this.perfilesAsignados[this.editIndex] = {
          perfil,
          aduana: aduanaSistema,
          fechaInicio: fechaInicioPerfil,
          fechaFin: fechaFinPerfil
        };
      }
      Swal.fire('Éxito', 'Perfil actualizado', 'success').then(() => {
        // Reset the perfil fields
        this.userForm.patchValue({
          perfil: '',
          aduanaSistema: '',
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
  }

  scrollToForm(index: number) {
    const formElement = document.querySelector(`#form-${index}`);
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
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
