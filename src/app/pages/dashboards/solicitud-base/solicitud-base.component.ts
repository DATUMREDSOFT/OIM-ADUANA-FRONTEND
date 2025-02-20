import { Component, OnInit, SimpleChanges, inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TablerIconsModule } from 'angular-tabler-icons';
import Swal from 'sweetalert2';

import { ApiService } from '../../../services/api.service';
import { ProcesoFormularioService } from '../../../services/proceso-formulario.service';
import { UserService } from '../../../services/user.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { DropdownDataService } from 'src/app/services/dropdown-data.service';

import { TipoSolicitud } from '../solicitud-base/models/tipo-solicitud.model';
import { FormularioExterno } from './models/formulario-externo.model';

import { MaterialModule } from '../../../material.module';
import { AppSolicitudModificarUsuarioComponent } from './solicitud-modificar-usuario/solicitud-modificar-usuario.component';
import { AppSolicitudNuevoUsuarioComponent } from "./solicitud-nuevo-usuario/solicitud-nuevo-usuario.component";
import { Roles } from '../../../enums/roles.enum';

@Component({
  selector: 'app-solicitud-base',
  templateUrl: './solicitud-base.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatCardModule,
    MatNativeDateModule,
    MatExpansionModule,
    TablerIconsModule,
    ReactiveFormsModule,
    AppSolicitudNuevoUsuarioComponent,
    AppSolicitudModificarUsuarioComponent
  ],
})
export class AppSolicitudBaseComponent implements OnInit {
  solicitudForm: FormGroup;
  tiposSolicitud: TipoSolicitud[] = [];

  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly procesoFormulario = inject(ProcesoFormularioService);
  private readonly userService = inject(UserService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dropdownDataService = inject(DropdownDataService);

  sistemas = this.dropdownDataService.sistemas;
  perfiles = this.dropdownDataService.perfiles;
  aduanas = this.dropdownDataService.aduanas;

  @ViewChild('fileInput') fileInput: ElementRef;
  selectedFile: File | null = null;

  constructor() {
    this.solicitudForm = this.fb.group({
      formularios: this.fb.array([this.createFormulario()])
    });
  }

  async ngOnInit(): Promise<void> {
    this.loadTiposSolicitudFromStorage();
    await this.dropdownDataService.obtenerSistemas();
    await this.dropdownDataService.obtenerPerfiles();
    await this.dropdownDataService.obtenerAduanas();
  }

  get formularios(): FormArray {
    return this.solicitudForm.get('formularios') as FormArray;
  }

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  getUserIndex(formIndex: number, userIndex: number): number {
    return userIndex;
  }

  private loadTiposSolicitudFromStorage(): void {
    let storedData: any;
    const rawStoredData = localStorage.getItem('tipo-solicitud');
    console.log("🔍 Directly Retrieved from localStorage:", rawStoredData);

    if (rawStoredData) {
      try {
        storedData = JSON.parse(rawStoredData);
      } catch (error) {
        console.error("❌ Error parsing localStorage data:", error);
        return;
      }
    }

    if (!storedData) {
      storedData = this.localStorageService.getItem('tipo-solicitud');
      console.log("🔍 Retrieved from localStorageService:", storedData);
    }

    if (!storedData || !storedData.value || !Array.isArray(storedData.value)) {
      console.warn("⚠️ No valid tipos-solicitud found in storage.", storedData);
      return;
    }

    this.tiposSolicitud = storedData.value.map((tipo: any) => ({
      id: tipo.id,
      value: tipo.value
    }));

    console.log("✅ Successfully loaded tipos-solicitud:", this.tiposSolicitud);
  }

  private createFormulario(): FormGroup {
    return this.fb.group({
      tipo: ['', Validators.required],
      childComponent: [null],
      form: this.fb.group({
        uid: [''],
        nombre: [''],
        apellido: [''],
        correo: [''],
        telefono: [''],
        movil: [''],
        correoAlternativo: [''],
        fechaInicioSolicitud: [''],
        fechaFinSolicitud: [''],
        sistema: [''],
        fechaInicioSistema: [''],
        fechaFinSistema: [''],
        perfil: [''],
        aduanaPerfil: [''],
        fechaInicioPerfil: [''],
        fechaFinPerfil: ['']
      }),
      usuarios: this.fb.array([])
    });
  }

  private createUsuarioForm(): FormGroup {
    return this.fb.group({
      dui: [''],
      uid: [''],
      nombre: [''],
      apellido: [''],
      telefono: [''],
      movil: [''],
      correo: [''],
      correoAlternativo: [''],
      fechaInicioSolicitud: [''],
      fechaFinSolicitud: [''],
      sistema: [''],
      fechaInicioSistema: [''],
      fechaFinSistema: [''],
      perfil: [''],
      aduanaPerfil: [''],
      fechaInicioPerfil: [''],
      fechaFinPerfil: [''],
      sistemas: this.fb.array([this.createDefaultSistema()])
    });
  }

  private createDefaultSistema(): FormGroup {
    return this.fb.group({
      nombre: ['SIAP'],
      estado: ['deactivated']
    });
  }

  generateUID(index: number) {
    const formulario = this.formularios.at(index);
    const nombres = formulario.get('form.nombres')?.value.trim().split(' ')[0] || '';
    const apellidos = formulario.get('form.apellidos')?.value.trim().split(' ')[0] || '';
    const uid = `${nombres.toLowerCase()}.${apellidos.toLowerCase()}`;
    formulario.get('form.uid')?.setValue(uid);
  }

  getUsuarioForm(formulario: AbstractControl, index: number): FormArray {
    return (formulario.get('usuarios') as FormArray);
  }

  getUsuarios(formulario: FormGroup): FormArray {
    return formulario.get('usuarios') as FormArray;
  }

  addUsuario(index: number): void {
    console.log('addUsuario called'); // Debugging log
    const usuarios = this.getUsuarios(this.formularios.at(index) as FormGroup);
    usuarios.push(this.createUsuarioForm());
    this.cdr.detectChanges(); // Trigger change detection
  }

  removeUsuario(formIndex: number, userIndex: number): void {
    const usuarios = this.getUsuarios(this.formularios.at(formIndex) as FormGroup);
    if (usuarios.length > 1) {
      Swal.fire({
        title: '¿Está seguro?',
        text: `Se removerá usuario ${userIndex + 1}, ¿está seguro de continuar?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33', // Red color for the confirm button
        cancelButtonColor: '#3085d6' // Blue color for the cancel button
      }).then((result) => {
        if (result.isConfirmed) {
          usuarios.removeAt(userIndex);
          Swal.fire('Eliminado', `El usuario ${userIndex + 1} ha sido eliminado`, 'success');
        }
      });
    }
  }

  addFormulario() {
    this.formularios.push(this.createFormulario());
  }

  removeFormulario(index: number) {
    if (this.formularios.length > 1) {
      Swal.fire({
        title: '¿Está seguro?',
        text: `Esta acción eliminará el formulario ${index + 1}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33', // Red color for the confirm button
        cancelButtonColor: '#3085d6' // Blue color for the cancel button
      }).then((result) => {
        if (result.isConfirmed) {
          this.formularios.removeAt(index);
          Swal.fire('Eliminado', `El formulario ${index + 1} ha sido eliminado`, 'success');
        }
      });
    }
  }

  updateSelectedTipoSolicitud(index: number) {
    const formulario = this.formularios.at(index) as FormGroup;
    const selectedTipo = formulario.get('tipo')?.value;

    if (!selectedTipo) {
      return;
    }

    let componentToLoad: string | null = null;
    switch (selectedTipo) {
      case 'TYREQ-1':
        componentToLoad = 'TYREQ-1';
        break;
      case 'TYREQ-2':
        componentToLoad = 'TYREQ-2';
        break;
      case 'TYREQ-3':
        componentToLoad = null;
        break;
      default:
        return;
    }

    const currentChild = formulario.get('childComponent')?.value;

    if (currentChild && currentChild !== componentToLoad) {
      Swal.fire({
        title: '¿Está seguro?',
        text: '¿Desea cambiar el tipo de formulario? Se perderán todos los datos',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
      }).then((result) => {
        if (result.isConfirmed) {
          this.clearFormulario(formulario);
          this.loadComponent(formulario, componentToLoad, index);
        } else {
          formulario.get('tipo')?.setValue(currentChild, { emitEvent: false });
        }
      });
    } else {
      this.loadComponent(formulario, componentToLoad, index);
    }
  }

  private loadComponent(formulario: FormGroup, componentToLoad: string | null, index: number) {
    formulario.patchValue({ childComponent: componentToLoad });
    this.cdr.detectChanges();

    if (componentToLoad) {
      const usuarios = this.getUsuarios(formulario);
      if (usuarios.length === 0) {
        this.addUsuario(index);
      }
    }
  }

  private clearFormulario(formulario: FormGroup) {
    formulario.patchValue({
      form: {
        uid: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        movil: '',
        correoAlternativo: '',
        fechaInicioSolicitud: '',
        fechaFinSolicitud: '',
        sistema: '',
        fechaInicioSistema: '',
        fechaFinSistema: '',
        perfil: '',
        aduanaPerfil: '',
        fechaInicioPerfil: '',
        fechaFinPerfil: ''
      },
      usuarios: []
    });
    const usuarios = this.getUsuarios(formulario);
    while (usuarios.length) {
      usuarios.removeAt(0);
    }
  }

  scrollToForm(index: number) {
    const form = document.getElementById(`form-${index}`);
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
  }

  async enviarFormulario(): Promise<void> {
    try {
      Swal.fire({
        title: 'Procesando...',
        text: 'Enviando formulario, por favor espere...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // 🔥 Burnt Data for Testing (Step 1)
      const burntFormData = {
        createdOn: "1739997502620",
        createdBy: "011615402",
        modifiedOn: "1739997502620",
        modifiedBy: "011615402",
        closed: false,
        step: "-",
        requests: [
          {
            id: "Pendiente de guardar",
            typeRequest: { id: "TYREQ-1", value: "Nuevo Usuario" },
            state: "PENDIENTE DE ASIGNAR",
            createBy: "011615402",
            createOn: "1739997483193",
            profiles: [{}],
            resources: [{}],
            systems: [
              {
                id: "CATSYS-12",
                status: "PENDIENTE DE ASIGNAR",
                group: { id: "CATGRP-78", value: "PAGOES", status: "ENABLED" },
                custom: {},
                endDate: "1740700800000",
                type: "Externo",
                startDate: "1739923200000"
              }
            ],
            others: [{}],
            flow: [{}],
            person: {
              document: "0963783311",
              mail: "test300@gmail.com",
              uid: "test.test",
              position: {},
              levelOne: {},
              levelTwo: {},
              levelThree: {},
              levelFour: {},
              attribute: {},
              fullName: "null ",
              lastName: "test",
              surName: "test300",
              organizationCode: "DGA Externo",
              phoneNumber: "78787878",
              mobile: "89898989"
            }
          }
        ],
        applicant: {
          document: "011615402",
          position: {},
          attribute: {},
          externalType: { id: "PERSONAL", value: "Persona Natural", status: "ENABLED" },
          name: "SANDRA GABRIELLA CRUZ CHAVEZ",
          externalName: "SANDRA GABRIELLA CRUZ CHAVEZ",
          mail: "test7@gmail.com"
        },
        applicantViewer: "-",
        file1: "",
        status: "PENDING",
        formType: "Externo",
        createdName: "SANDRA GABRIELLA CRUZ CHAVEZ"
      };

      console.log("🚀 Step 1: Sending Initial Form...");
      const formResponse = await this.apiService.request('POST', 'dga/form', { body: burntFormData }).toPromise();
      console.log('✅ Step 1 Success:', formResponse);

      // 🔥 Ensure `formId` is retrieved
      const formId = (formResponse as any)?.id;
      if (!formId) throw new Error('❌ Form submission failed: No form ID returned.');

      // 🔥 Burnt Data for Testing (Step 2)
      const burntRequestData = {
        id: "Pendiente de guardar",
        typeRequest: { id: "TYREQ-1", value: "Nuevo Usuario" },
        state: "PENDING",
        createBy: "NA",
        createOn: "1739997483193",
        profiles: [{}],
        resources: [{}],
        systems: [
          {
            id: "CATSYS-12",
            status: "PENDIENTE DE ASIGNAR",
            group: { id: "CATGRP-78", value: "PAGOES", status: "ENABLED" },
            custom: {},
            endDate: "1740700800000",
            type: "Externo",
            startDate: "1739923200000"
          }
        ],
        others: [{}],
        flow: [{}],
        person: {
          document: "0963783311",
          mail: "test7@gmail.com",
          uid: "test.test",
          position: {},
          levelOne: {},
          levelTwo: {},
          levelThree: {},
          levelFour: {},
          attribute: {},
          fullName: "null ",
          lastName: "test",
          surName: "test6",
          organizationCode: "DGA Externo",
          phoneNumber: "78787878",
          mobile: "89898989"
        }
      };

      console.log(`🚀 Step 2: Sending Form Request for Form ID: ${formId}...`);
      const requestResponse = await this.apiService.request('POST', `dga/form/request/${formId}`, { body: burntRequestData }).toPromise();
      console.log('✅ Step 2 Success:', requestResponse);

      // 🔥 Ensure `requestId` is retrieved correctly
      let requestId = (requestResponse as any)?.id;
      if (!requestId && (requestResponse as any)?.source?.id) {
        requestId = (requestResponse as any).source.id; // Handle nested response
      }
      if (!requestId) throw new Error('❌ Request submission failed: No request ID returned.');

      // 🔥 Burnt Data for Testing (Step 3)
      const burntSystemData = {
        id: "CATSYS-12",
        status: "PENDIENTE DE ASIGNAR",
        group: { id: "CATGRP-78", value: "PAGOES", status: "ENABLED" },
        temporal: true,
        custom: {},
        endDate: "1740700800000",
        type: "Externo",
        startDate: "1739923200000"
      };

      console.log(`🚀 Step 3: Assigning System to Request ID: ${requestId}...`);
      const systemResponse = await this.apiService.request('POST', `dga/form/request/system/${requestId}`, { body: burntSystemData }).toPromise();
      console.log('✅ Step 3 Success:', systemResponse);

      // 🔥 Step 4: Commit the Form
      console.log(`🚀 Step 4: Committing Form for Request ID: ${requestId}...`);
      const commitResponse = await this.apiService.request('POST', `dga/flow?requestId=${requestId}&processId=NA`).toPromise();
      console.log('✅ Step 4 Success: Form committed', commitResponse);

      // 🔥 Step 5: Send Email Notification
      console.log(`🚀 Step 5: Sending Email Notification for Request ID: ${requestId}...`);
      const emailResponse = await this.apiService.request('GET', `dga/flow/email?requestId=${requestId}`).toPromise();
      console.log('✅ Step 5 Success: Email sent', emailResponse);

      Swal.fire({
        title: 'Éxito',
        text: 'El formulario ha sido enviado exitosamente.',
        icon: 'success'
      });

    } catch (error: any) {
      console.error('❌ Error Sending Form:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un problema al enviar el formulario. Revisa la consola para más detalles.',
        icon: 'error'
      });
    }
  }

  
  
}
