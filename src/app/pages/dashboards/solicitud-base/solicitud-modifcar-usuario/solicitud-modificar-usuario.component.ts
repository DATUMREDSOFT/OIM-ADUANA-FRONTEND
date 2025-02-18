import {Component, ViewChild, OnInit, Input, SimpleChange, SimpleChanges, ChangeDetectorRef} from '@angular/core';
// import { MatStepper } from '@angular/material/stepper';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../../material.module';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {MatNativeDateModule} from '@angular/material/core';
import Swal from 'sweetalert2';
import {MatAccordion} from '@angular/material/expansion';
import {MatExpansionModule} from '@angular/material/expansion';
import {DatePipe} from '@angular/common';
import {MatTableDataSource, MatTable} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';

// icons
import {TablerIconsModule} from 'angular-tabler-icons';
import {FormServiceService} from "../../../../services/form-service.service";

export interface sistemaAsignado {
  sistema: string;
  fechaInicioSistema: string;
  fechaFinSistema: string;
}

const sistemasAsignados: sistemaAsignado[] = [];

@Component({
  selector: 'app-solicitud-modificar-usuario',
  templateUrl: './solicitud-modifcar-usuario.component.html',
  standalone: true,
  providers: [DatePipe],
  imports: [MaterialModule, MatCardModule, FormsModule, ReactiveFormsModule, CommonModule, MatNativeDateModule, MatExpansionModule, TablerIconsModule, MatTable, MatTabsModule],
})
export class AppSolicitudModificarUsuarioComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatTable, {static: true}) table: MatTable<any> = Object.create(null);
  @Input() formGroup!: FormGroup;
  @Input() userIndex!: number; // Add this line to accept the index from the parent component
  userForm: FormGroup;
  userRequests: any[] = [];
  perfilesAsignados: any[] = [];

  currentUser: any = null;
  editIndex: number | null = null;
  editMode: boolean = false;
  editType: 'perfil' | 'sistema' | null = null;

  sistemaAsignado: [sistemaAsignado];


  selectedSolicitud: string = '';
  isLoading: boolean = false;
  shouldSave: boolean = false;

  displayedColumns: string[] = ['sistema', 'fechaInicioSistema', 'fechaFinSistema']; // Add this line
  dataSource = new MatTableDataSource(sistemasAsignados);

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
    const fechaInicioSistema = this.datePipe.transform(this.formGroup.get('fechaInicioSistema')?.value, 'MM/dd/yyyy');
    const fechaFinSistema = this.datePipe.transform(this.formGroup.get('fechaFinSistema')?.value, 'MM/dd/yyyy');

    if (sistema && fechaInicioSistema && fechaFinSistema) {
      this.dataSource.data.unshift({
        sistema: sistema,
        fechaInicioSistema: fechaInicioSistema,
        fechaFinSistema: fechaFinSistema,
      });
      this.table.renderRows(); // Refresh the table
      this.userForm.reset(); // Reset the form after adding the system
    } else {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
    }
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
