import {Component, ViewChild, OnInit, Input, SimpleChanges, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../../material.module';
import {MatCardModule} from '@angular/material/card';
import {CommonModule, DatePipe} from '@angular/common';
import {MatNativeDateModule} from '@angular/material/core';
import Swal from 'sweetalert2';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatTableDataSource, MatTable} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBar} from '@angular/material/snack-bar';

// icons
import {TablerIconsModule} from 'angular-tabler-icons';

export interface SistemaAsignado {
  sistema: string;
  fechaInicioSistema: Date;
  fechaFinSistema: Date;
}

export interface PerfilAsignado {
  perfil: string;
  aduanaPerfil: string;
  fechaInicioPerfil: Date;
  fechaFinPerfil: Date;
}

@Component({
  selector: 'app-solicitud-nuevo-usuario',
  templateUrl: './solicitud-nuevo-usuario.component.html',
  standalone: true,
  providers: [DatePipe],
  imports: [MaterialModule, MatCardModule, FormsModule, ReactiveFormsModule, CommonModule, MatNativeDateModule, MatExpansionModule, TablerIconsModule, MatTable, MatTabsModule],
})
export class AppSolicitudNuevoUsuarioComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatTable, {static: true}) table: MatTable<any> = Object.create(null);
  @Input() formGroup!: FormGroup;
  @Input() userIndex!: number; // Add this line to accept the index from the parent component
  userForm: FormGroup;
  userRequests: any[] = [];
  currentUser: any = null;
  editIndex: number | null = null;
  editMode: boolean = false;
  editType: 'perfil' | 'sistema' | null = null;

  sistemaAsignado: [SistemaAsignado];

  isEditingSistema: boolean = false;
  isEditingPerfil: boolean = false;
  editingIndexSistema: number | null = null;
  editingIndexPerfil: number | null = null;

  selectedSolicitud: string = '';
  isLoading: boolean = false;
  shouldSave: boolean = false;

  displayedColumns: string[] = ['sistema', 'fechaInicioSistema', 'fechaFinSistema', 'accion'];
  displayedColumnsPerfil: string[] = ['perfil', 'aduanaPerfil', 'fechaInicioPerfil', 'fechaFinPerfil', 'accion'];

  dataSourceSistemas = new MatTableDataSource<SistemaAsignado>([]);
  dataSourcePerfil = new MatTableDataSource<PerfilAsignado>([]);

  constructor(private snackBar: MatSnackBar, private fb: FormBuilder, private datePipe: DatePipe, private cdr: ChangeDetectorRef) {

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

  addAnotherForm() {
    this.userRequests.push({
      duiNit: '',
      nombre: '',
      apellido: '',
      usuario: '',
      email: '',
      organizacion: 'DGA',
      estado: '',
      rol: '',
      cargo: '',
      perfiles: [],
      sistemas: [],
      tipoSolicitud: ''
    });
  }

  asignarSistema(): void {
    const sistema = this.formGroup.get('sistema')?.value;
    const fechaInicioSistema = this.formGroup.get('fechaInicioSistema')?.value;
    const fechaFinSistema = this.formGroup.get('fechaFinSistema')?.value;

    if (sistema && fechaInicioSistema && fechaFinSistema) {
      if (this.isEditingSistema && this.editingIndexSistema !== null) {
        // Update the selected row
        const updatedData = [...this.dataSourceSistemas.data]; // Clone the array
        updatedData[this.editingIndexSistema] = {
          sistema,
          fechaInicioSistema: new Date(fechaInicioSistema),
          fechaFinSistema: new Date(fechaFinSistema),
        };
        this.dataSourceSistemas.data = updatedData; // Assign new reference

        this.isEditingSistema = false;
        this.editingIndexSistema = null;
      } else {
        // Add new entry
        this.dataSourceSistemas.data = [
          ...this.dataSourceSistemas.data,
          {sistema, fechaInicioSistema: new Date(fechaInicioSistema), fechaFinSistema: new Date(fechaFinSistema)},
        ];
      }

      this.resetForm();
    } else {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
    }
  }

  asignarPerfil(): void {
    const perfil = this.formGroup.get('perfil')?.value;
    const aduanaPerfil = this.formGroup.get('aduanaPerfil')?.value;
    const fechaInicioPerfil = this.formGroup.get('fechaInicioPerfil')?.value;
    const fechaFinPerfil = this.formGroup.get('fechaFinPerfil')?.value;

    if (perfil && aduanaPerfil && fechaInicioPerfil && fechaFinPerfil) {
      if (this.isEditingPerfil && this.editingIndexPerfil !== null) {
        // Update the selected row
        const updatedData = [...this.dataSourcePerfil.data]; // Clone the array
        updatedData[this.editingIndexPerfil] = {
          perfil,
          aduanaPerfil,
          fechaInicioPerfil: new Date(fechaInicioPerfil),
          fechaFinPerfil: new Date(fechaFinPerfil),
        };
        this.dataSourcePerfil.data = updatedData; // Assign new reference

        this.isEditingPerfil = false;
        this.editingIndexPerfil = null;
      } else {
        // Add new entry
        this.dataSourcePerfil.data = [
          ...this.dataSourcePerfil.data,
          {
            perfil,
            aduanaPerfil,
            fechaInicioPerfil: new Date(fechaInicioPerfil),
            fechaFinPerfil: new Date(fechaFinPerfil)
          },
        ];
      }

      this.resetForm();
    } else {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
    }
  }

  editarSistema(index: number): void {

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Si edita este sistema, se sobrescribirá la información anterior.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const item = this.dataSourceSistemas.data[index];
        this.formGroup.patchValue({
          sistema: item.sistema,
          fechaInicioSistema: new Date(item.fechaInicioSistema),
          fechaFinSistema: new Date(item.fechaFinSistema),
        });

        this.isEditingSistema = true;
        this.editingIndexSistema = index;


        // 📢 Muestra el Toast de confirmación
        this.snackBar.open('Modo Edición Activado: Ahora puede modificar el sistema.', 'Cerrar', {
          duration: 3000, // Duración en milisegundos
          panelClass: ['toast-message'],
          horizontalPosition: 'end',  // Alineado a la derecha
          verticalPosition: 'top' // Clase CSS opcional
        });
      } else {
        // 📢 Muestra el Toast si cancela
        this.snackBar.open('Edición cancelada.', 'Cerrar', {
          duration: 3000,
          panelClass: ['toast-message'],
          horizontalPosition: 'end',  // Alineado a la derecha
          verticalPosition: 'top'
        });


      }
    });

  }

  editarPerfil(index: number): void {

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Si edita este perfil, se sobrescribirá la información anterior.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const item = this.dataSourcePerfil.data[index];
        this.formGroup.patchValue({
          perfil: item.perfil,
          aduanaPerfil: item.aduanaPerfil,
          fechaInicioPerfil: new Date(item.fechaInicioPerfil),
          fechaFinPerfil: new Date(item.fechaFinPerfil),
        });

        this.isEditingPerfil = true;
        this.editingIndexPerfil = index;

        // 📢 Muestra el Toast de confirmación
        this.snackBar.open('Modo Edición Activado: Ahora puede modificar el perfil.', 'Cerrar', {
          duration: 3000, // Duración en milisegundos
          panelClass: ['toast-message'],
          horizontalPosition: 'end',  // Alineado a la derecha
          verticalPosition: 'top' // Clase CSS opcional
        });
      } else {
        // 📢 Muestra el Toast si cancela
        this.snackBar.open('Edición cancelada.', 'Cerrar', {
          duration: 3000,
          panelClass: ['toast-message'],
          horizontalPosition: 'end',  // Alineado a la derecha
          verticalPosition: 'top'
        });
      }
    });

  }

  eliminarSistema(index: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará el sistema asignado permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataSourceSistemas.data.splice(index, 1);
        this.dataSourceSistemas.data = [...this.dataSourceSistemas.data];
        this.resetForm();

        // 📢 Mostrar Toast en la esquina superior derecha
        this.snackBar.open('Sistema eliminado correctamente.', 'Cerrar', {
          duration: 3000,
          panelClass: ['toast-message'],
          horizontalPosition: 'end', // Alineado a la derecha
          verticalPosition: 'top' // En la parte superior
        });
      }
    });
  }

  eliminarPerfil(index: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará el perfil asignado permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataSourcePerfil.data.splice(index, 1);
        this.dataSourcePerfil.data = [...this.dataSourcePerfil.data];
        this.resetForm();

        // 📢 Mostrar Toast en la esquina superior derecha
        this.snackBar.open('Perfil eliminado correctamente.', 'Cerrar', {
          duration: 3000,
          panelClass: ['toast-message'],
          horizontalPosition: 'end', // Alineado a la derecha
          verticalPosition: 'top' // En la parte superior
        });
      }
    });
  }

  resetForm(): void {
    this.formGroup.reset();
    this.isEditingSistema = false;
    this.isEditingPerfil = false;
    this.editingIndexSistema = null;
    this.editingIndexPerfil = null;
    this.cdr.detectChanges();
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
