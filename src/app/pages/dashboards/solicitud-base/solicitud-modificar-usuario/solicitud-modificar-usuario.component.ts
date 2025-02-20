import {Component, ViewChild, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../../material.module';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import Swal from 'sweetalert2';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {DatePipe, CommonModule} from '@angular/common';
import {MatTable} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {TablerIconsModule} from 'angular-tabler-icons';


@Component({
  selector: 'app-solicitud-modificar-usuario',
  templateUrl: './solicitud-modificar-usuario.component.html',
  standalone: true,
  providers: [DatePipe],
  imports: [MaterialModule, MatCardModule, FormsModule, ReactiveFormsModule, CommonModule, MatNativeDateModule, MatExpansionModule, TablerIconsModule, MatTable, MatTabsModule],
})
export class AppSolicitudModificarUsuarioComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatTable, {static: true}) table: MatTable<any> = Object.create(null);
  @Input() formGroup!: FormGroup;
  @Input() userIndex!: number; // Add this line to accept the index from the parent component


  mockFormData: any = {
    id: '12345',
    createdOn: new Date().toISOString(),
    createdBy: 'AdminUser',
    modifiedOn: new Date().toISOString(),
    modifiedBy: 'AdminUser',
    step: '-',
    comment: 'Solicitud generada desde Angular 18',
    applicantViewer: '-',
    status: 'PENDING',
    createdName: 'Solicitante',
    formType: 'AFPA',
    applicant: {

      document: '123456789',
      uid: 'UID-001',
      name: 'John Doe',
      externalName: 'Doe',
      mail: 'john.doe@example.com',
      telefono: '555-1234',
      movil: '555-5678',
      correoAlternativo: 'john.alt@example.com',
      externalRepLegal: '',
      externalCodeDeclarant: '',
      position: {id: 'POS-001', value: 'Gerente'},
      attribute: {id: 'ATTR-001', value: 'Empleado'},
      externalType: {id: 'PERSONAL', status: 'ENABLED', value: 'Persona Natural'}
    }
  };


  userType = this.mockFormData.formType

  ngOnInit() {
    // Inicializar el formulario con valores simulados
    this.formGroup = new FormGroup({
      nombre: new FormControl({value: this.mockFormData.applicant.name, disabled: true}),
      apellido: new FormControl({value: this.mockFormData.applicant.externalName, disabled: true}),
      correo: new FormControl(this.mockFormData.applicant.mail),
      telefono: new FormControl(''),
      movil: new FormControl(''),
      correoAlternativo: new FormControl('')
    });
  }


  selectedSolicitud: string = '';
  isLoading: boolean = false;
  shouldSave: boolean = false;
  UserType: string;


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
