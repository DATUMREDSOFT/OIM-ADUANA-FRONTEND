import { Component, ViewChild, OnInit, Input, SimpleChanges, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAccordion } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import Swal from 'sweetalert2';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Roles } from 'src/app/enums/roles.enum';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MaterialModule } from 'src/app/material.module';

// icons


export interface sistemaAsignado {
  sistema: string;
  fechaInicioSistema: Date;
  fechaFinSistema: Date;
}

export interface perfilAsignado {
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
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @Input() formGroup!: FormGroup;
  @Input() userIndex!: number; // Add this line to accept the index from the parent component
  userForm: FormGroup;
  userRequests: any[] = [];
  currentUser: any = null;
  editIndex: number | null = null;
  editMode: boolean = false;
  editType: 'perfil' | 'sistema' | null = null;

  sistemaAsignado: [sistemaAsignado];

  isEditingSistema: boolean = false;
  isEditingPerfil: boolean = false;
  editingIndexSistema: number | null = null;
  editingIndexPerfil: number | null = null;

  userType: string = ''; // Stores the user type

  @Input() sistemas: any[] = []; // ✅ Receive from parent
  @Input() perfiles: any[] = []; // ✅ Receive from parent
  @Input() aduanas: any[] = []; // ✅ Receive from parent

  selectedSolicitud: string = '';
  isLoading: boolean = false;
  shouldSave: boolean = false;

  displayedColumns: string[] = ['sistema', 'fechaInicioSistema', 'fechaFinSistema', 'accion'];
  displayedColumnsPerfil: string[] = ['perfil', 'aduanaPerfil', 'fechaInicioPerfil', 'fechaFinPerfil', 'accion'];

  dataSourceSistemas = new MatTableDataSource<sistemaAsignado>([]);
  dataSourcePerfil = new MatTableDataSource<perfilAsignado>([]);

  constructor(private fb: FormBuilder, private datePipe: DatePipe, private cdr: ChangeDetectorRef, private localStorageService: LocalStorageService) {
    this.userForm = this.fb.group({
      sistema: ['', Validators.required],
      fechaInicioSistema: ['', Validators.required],
      fechaFinSistema: ['', Validators.required],
      perfil: ['', Validators.required],
      aduanaPerfil: ['', Validators.required],
      fechaInicioPerfil: ['', Validators.required],
      fechaFinPerfil: ['', Validators.required],
    });
  }

  ngOnInit():void {
    this.loadUserType();
    if (!this.formGroup) {
      console.warn("❌ Warning: `formGroup` is undefined in `solicitud-externo.component.ts`.");
    } else {
      console.log("✅ Received `formGroup` on Init:", this.formGroup.value);
    }

    console.log('✅ Sistemas:', this.sistemas);
    console.log('✅ Perfiles:', this.perfiles);
    console.log('✅ Aduanas:', this.aduanas);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formGroup']?.currentValue) {
      console.log("✅ `formGroup` Updated:", changes['formGroup'].currentValue);
    }
    if (changes['userIndex']?.currentValue) {
      console.log("✅ `userIndex` Updated:", changes['userIndex'].currentValue);
    }
  }

  private loadUserType() {
    const storedUser = this.localStorageService.getItem<{ value: string }>('tipo-usuario');
    this.userType = storedUser?.value || '';

    console.log('🔍 Loaded User Type:', this.userType);
  }

  /** ✅ Get Filtered Systems (Only CATSYS-12 for NOAFPA Users) */
  get filteredSistemas(): any[] {
    return this.userType === Roles.NOAFPA
      ? this.sistemas.filter(sistema => sistema.id === 'CATSYS-12')
      : this.sistemas;
  }

  /** ✅ Check if Perfil Tab Should Be Hidden */
  get shouldShowPerfilTab(): boolean {
    return this.userType !== Roles.NOAFPA;
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
          { sistema, fechaInicioSistema: new Date(fechaInicioSistema), fechaFinSistema: new Date(fechaFinSistema) },
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
          { perfil, aduanaPerfil, fechaInicioPerfil: new Date(fechaInicioPerfil), fechaFinPerfil: new Date(fechaFinPerfil) },
        ];
      }
  
      this.resetForm();
    } else {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
    }
  }
  
  editarSistema(index: number): void {
    const item = this.dataSourceSistemas.data[index];
    this.formGroup.patchValue({
      sistema: item.sistema,
      fechaInicioSistema: new Date(item.fechaInicioSistema),
      fechaFinSistema: new Date(item.fechaFinSistema),
    });

    this.isEditingSistema = true;
    this.editingIndexSistema = index;
  }

  editarPerfil(index: number): void {
    const item = this.dataSourcePerfil.data[index];
    this.formGroup.patchValue({
      perfil: item.perfil,
      aduanaPerfil: item.aduanaPerfil,
      fechaInicioPerfil: new Date(item.fechaInicioPerfil),
      fechaFinPerfil: new Date(item.fechaFinPerfil),
    });

    this.isEditingPerfil = true;
    this.editingIndexPerfil = index;
  }

  eliminarSistema(index: number): void {
    this.dataSourceSistemas.data.splice(index, 1);
    this.dataSourceSistemas.data = [...this.dataSourceSistemas.data];
    this.resetForm();
  }

  eliminarPerfil(index: number): void {
    this.dataSourcePerfil.data.splice(index, 1);
    this.dataSourcePerfil.data = [...this.dataSourcePerfil.data];
    this.resetForm();
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
