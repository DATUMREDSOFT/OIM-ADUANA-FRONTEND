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
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Roles } from 'src/app/enums/roles.enum';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MaterialModule } from 'src/app/material.module';
import { ApiService } from 'src/app/services/api.service';


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
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @Input() formGroup!: FormGroup;
  @Input() userIndex!: number; // Add this line to accept the index from the parent component
  userForm: FormGroup;
  userRequests: any[] = [];
  currentUser: any = null;
  editIndex: number | null = null;
  editMode: boolean = false;
  editType: 'perfil' | 'sistema' | null = null;
  minDate = new Date(); // 🔥 Today (disables past dates)

  systemNameMap = new Map<string, string>();


  sistemaAsignado: [SistemaAsignado];

  isEditingSistema: boolean = false;
  isEditingPerfil: boolean = false;
  editingIndexSistema: number | null = null;
  editingIndexPerfil: number | null = null;

  userType: string = ''; // Stores the user type

  @Input() sistemas: any[] = []; // ✅ Receive from parent
  @Input() perfiles: any[] = []; // ✅ Receive from parent
  @Input() aduanas: any[] = []; // ✅ Receive from parent

  selectedSolicitud: string = '';
  loading: boolean = false;
  shouldSave: boolean = false;

  displayedColumns: string[] = ['sistema', 'fechaInicioSistema', 'fechaFinSistema', 'accion'];
  displayedColumnsPerfil: string[] = ['perfil', 'aduanaPerfil', 'fechaInicioPerfil', 'fechaFinPerfil', 'accion'];

  dataSourceSistemas = new MatTableDataSource<SistemaAsignado>([]);
  dataSourcePerfil = new MatTableDataSource<PerfilAsignado>([]);

  constructor(private fb: FormBuilder, private datePipe: DatePipe, private cdr: ChangeDetectorRef, private localStorageService: LocalStorageService, private snackBar: MatSnackBar, private apiService: ApiService) {
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

  ngOnInit(): void {
    this.loadUserType();

    this.systemNameMap = new Map(
      this.sistemas.map(sistema => [sistema.id, sistema.value])
    );

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

  async fetchUserData(): Promise<void> {
    this.loading = true;
    this.formGroup.get('dui')?.disable(); // ✅ Disable field while fetching

    let documentValue = this.formGroup.get('dui')?.value?.replace(/\D/g, '') || ''; // ✅ Remove dashes

    // ✅ DUI = 9 Digits (Ej: 12345678-9)
    // ✅ NIT = 14 Digits (Ej: 0614-240354-007-0)
    if (!(documentValue.length === 9 || documentValue.length === 14)) {
      Swal.fire('Error', 'Por favor, ingrese un número de DUI/NIT válido.', 'error');
      this.loading = false;
      this.formGroup.get('dui')?.enable(); // ✅ Re-enable field
      return;
    }

    this.loading = true; // ✅ Show spinner
    this.cdr.detectChanges(); // ✅ Update UI

    const formType = this.userType === 'NOAFPA' ? 'SolicitudNoAFPA' : 'SolicitudAFPA';
    const requestType = 'TYREQ-1';

    try {
      const response = await this.apiService.request<any>(
        'GET',
        `dga/form/request/user/load/${formType}/${requestType}/${documentValue}` // ✅ Send clean number
      ).toPromise();

      if (!response) {
        Swal.fire('No encontrado', 'No se encontraron datos para el documento ingresado.', 'warning');
        return;
      }

      this.populateUserForm(response);
      console.log('✅ User Data Loaded:', response);

      // ✅ Enable Editable Fields after fetching user data
      this.formGroup.get('correo')?.enable();
      this.formGroup.get('telefono')?.enable();
      this.formGroup.get('movil')?.enable();

      // ✅ Show success toast
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      }).fire({
        icon: "success",
        title: `Usuario encontrado: ${response.fullName}`
      });

    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      Swal.fire('Error', 'No se pudo recuperar los datos del usuario.', 'error');
    } finally {
      this.loading = false; // ✅ Hide spinner
      this.formGroup.get('dui')?.enable(); // ✅ Re-enable DUI field
      this.cdr.detectChanges(); // ✅ Update UI
    }
  }

  private populateUserForm(data: any): void {
    if (!this.formGroup) {
        console.error("❌ Parent FormGroup is undefined.");
        return;
    }

    this.formGroup.patchValue({
      uid: data.uid || '',
      nombre: data.surName || '',
      apellido: data.lastName || '',
      correo: data.mail || '',
      telefono: data.phoneNumber || '',
      movil: data.mobile || '',
      correoAlternativo: data.correoAlternativo || '',
      fechaInicioSolicitud: data.fechaInicioSolicitud || '',
      fechaFinSolicitud: data.fechaFinSolicitud || '',
      tipo: data.tipo || '',
      rol: data.rol || '',
      cargo: data.cargo || '',
      nivel1: data.nivel1 || '',
      nivel2: data.nivel2 || '',
      nivel3: data.nivel3 || '',
      nivel4: data.nivel4 || '',
      fechaInicio: data.fechaInicio || '',
      fechaFin: data.fechaFin || '',
      sistema: data.sistema || '',
      fechaInicioSistema: data.fechaInicioSistema || '',
      fechaFinSistema: data.fechaFinSistema || '',
      perfil: data.perfil || '',
      aduanaPerfil: data.aduanaPerfil || '',
      fechaInicioPerfil: data.fechaInicioPerfil || '',
      fechaFinPerfil: data.fechaFinPerfil || ''
    });

    console.log("✅ Updated Parent Form:", this.formGroup.value);
}


  

  validateEndDate(controlNameInicio: string, controlNameFin: string) {
    const fechaInicio = this.formGroup.get(controlNameInicio)?.value;
    const fechaFin = this.formGroup.get(controlNameFin)?.value;

    if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      this.formGroup.get(controlNameFin)?.setErrors({ invalidEndDate: true });
    } else {
      this.formGroup.get(controlNameFin)?.setErrors(null);
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
  /** ✅ Universal Function to Hide Components Based on User Type */
  shouldHideComponent(component: string): boolean {
    switch (component) {
      case 'perfilTab':
        return this.userType === Roles.NOAFPA; // Hide Perfiles Tab for NOAFPA users
      case 'rolesPermisosSection':
        return this.userType === Roles.NOAFPA; // Hide Roles y Permisos Section for NOAFPA users
      default:
        return false; // Show all other components by default
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
        // ✅ Update the selected row without clearing other form data
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
        // ✅ Add new entry without resetting the entire form
        this.dataSourceSistemas.data = [
          ...this.dataSourceSistemas.data,
          { sistema, fechaInicioSistema: new Date(fechaInicioSistema), fechaFinSistema: new Date(fechaFinSistema) },
        ];
      }

      // ✅ Only reset the dropdowns (sistema, fechaInicioSistema, fechaFinSistema)
      this.resetSistemaFields();
    } else {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
    }
  }

  // ✅ Function to reset only the Sistema-related dropdowns
  private resetSistemaFields(): void {
    this.formGroup.patchValue({
      sistema: '',
      fechaInicioSistema: '',
      fechaFinSistema: ''
    });
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
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  formatDocument() {
    let value = (this.formGroup.get('dui')?.value || '').replace(/\D/g, ''); // Remove non-digits
    if (value.length > 14) value = value.substring(0, 14);

    if (value.length <= 9) {
      this.formGroup.get('dui')?.setValue(value.replace(/(\d{8})(\d{1})/, '$1-$2'), { emitEvent: false });
    } else {
      this.formGroup.get('dui')?.setValue(value.replace(/(\d{4})(\d{6})(\d{3})(\d{1})/, '$1-$2-$3-$4'), { emitEvent: false });
    }
  }

  formatPhoneNumber(controlName: string): void {
    let value = this.formGroup.get(controlName)?.value || '';

    // ✅ Remove non-numeric characters
    value = value.replace(/\D/g, '');

    // ✅ Limit to 8 digits
    if (value.length > 8) value = value.substring(0, 8);

    // ✅ Format as "7777-7777" (dash added after 4th digit)
    if (value.length > 4) {
      value = value.replace(/(\d{4})(\d{1,4})/, '$1-$2');
    }

    this.formGroup.get(controlName)?.setValue(value, { emitEvent: false });
  }


  stripFormattingBeforeSubmit() {
    const rawDUI = this.formGroup.get('dui')?.value.replace(/\D/g, '') || ''; // Strip dashes
    const rawTelefono = this.formGroup.get('telefono')?.value.replace(/\D/g, '') || '';
    const rawMovil = this.formGroup.get('movil')?.value.replace(/\D/g, '') || '';

    this.formGroup.patchValue({
      dui: rawDUI,
      telefono: rawTelefono,
      movil: rawMovil
    });
  }


}
