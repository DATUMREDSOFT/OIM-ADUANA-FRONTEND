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
import {
  AppSolicitudModificarUsuarioComponent
} from './solicitud-modificar-usuario/solicitud-modificar-usuario.component';
import { AppSolicitudNuevoUsuarioComponent } from "./solicitud-nuevo-usuario/solicitud-nuevo-usuario.component";
import { Roles } from '../../../enums/roles.enum';
import { CommonAttribute } from 'src/app/models/common-attribute.model';
import { Applicant } from './models/applicant.model';

@Component({
  selector: 'app-solicitud-base',
  templateUrl: './solicitud-base.component.html',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatCardModule, MatNativeDateModule, MatExpansionModule, TablerIconsModule, ReactiveFormsModule, AppSolicitudNuevoUsuarioComponent, AppSolicitudModificarUsuarioComponent],
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

  getUserIndex(formularioIndex: number, userIndex: number): number {
    return userIndex;
  }

  onUserDataUpdated(event: { formIndex: number; userIndex: number; data: any }) {
    console.log('📢 Received user data update:', event);
  
    if (event.formIndex === undefined || event.userIndex === undefined) {
      console.error('❌ Missing `formIndex` or `userIndex` in userDataUpdated event!', event);
      return;
    }
  
    const formulario = this.formularios.at(event.formIndex) as FormGroup;
    if (!formulario) {
      console.error(`❌ Formulario at index ${event.formIndex} does not exist.`);
      return;
    }
  
    const usuarios = this.getUsuarios(formulario);
    if (event.userIndex >= usuarios.length) {
      console.error(`❌ User index ${event.userIndex} out of bounds for form ${event.formIndex}.`);
      return;
    }
  
    const usuario = usuarios.at(event.userIndex) as FormGroup;
    if (!usuario) {
      console.error(`❌ User at index ${event.userIndex} not found.`);
      return;
    }
  
    console.log(`✅ Updating Form ${event.formIndex}, User ${event.userIndex}:`, event.data);
  
    // ✅ Apply the new data
    usuario.patchValue(event.data);
  
    // ✅ Ensure UI is updated
    this.cdr.detectChanges();
  
    console.log(`✅ User ${event.userIndex} in Formulario ${event.formIndex} updated successfully.`);
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
            tipo: [''],
            rol: [''],
            cargo: [''],
            nivel1: [''],
            nivel2: [''],
            nivel3: [''],
            nivel4: [''],
            fechaInicio: [''],
            fechaFin: [''],
            sistema: [''],
            fechaInicioSistema: [''],
            fechaFinSistema: [''],
            perfil: [''],
            aduanaPerfil: [''],
            fechaInicioPerfil: [''],
            fechaFinPerfil: ['']
        }),
        usuarios: this.fb.array([]) // 🔥 ✅ Ensure usuarios is ALWAYS initialized
    });
}


private createUsuarioForm(): FormGroup {
  return this.fb.group({
    // ✅ Core user details
    document: [{ value: '', disabled: false }],  // DUI/NIT
    uid: [{ value: '', disabled: true }],
    surName: [{ value: '', disabled: true }],  // First name
    lastName: [{ value: '', disabled: true }], // Last name
    fullName: [{ value: '', disabled: true }],
    mail: [{ value: '', disabled: true }, Validators.required],
    phoneNumber: [{ value: '', disabled: true }],
    mobile: [{ value: '', disabled: true }],
    alternativeMail: ['', Validators.email],

    // ✅ Dates
    fechaInicioSolicitud: [''],
    fechaFinSolicitud: [''],
    startDate: [''],
    endDate: [''],

    // ✅ Job Information
    position: this.fb.group({
      id: [''],
      value: [''],
      status: ['']
    }),

    // ✅ Organizational Levels
    levelOne: this.fb.group({ id: [''], value: [''], status: [''] }),
    levelTwo: this.fb.group({ id: [''], value: [''], status: [''] }),
    levelThree: this.fb.group({ id: [''], value: [''], status: [''] }),
    levelFour: this.fb.group({ id: [''], value: [''], status: [''] }),

    // ✅ User Type Information
    userType: [''],
    OrganizationCode: ['DGA Externo'],
    state: ['PENDING'],
    resolution: [''],
    approveAFPA: [''],

    // ✅ Assigned Profiles & Systems
    profiles: this.fb.array([]), // 🔥 This will be dynamically populated
    systems: this.fb.array([]),  // 🔥 This will be dynamically populated
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
    if (!formulario.get('usuarios')) {
      console.warn("⚠️ 'usuarios' array not found, initializing it now...");
      formulario.setControl('usuarios', this.fb.array([])); // ✅ Ensure array exists
    }
    return formulario.get('usuarios') as FormArray;
  }
  

  addUsuario(index: number): void {
    const formulario = this.formularios.at(index) as FormGroup;
    const usuarios = this.getUsuarios(formulario);
  
    if (usuarios.length > 0) {
      const lastUser = usuarios.at(usuarios.length - 1).value;
      
      // 🔍 Check if the last user is empty before adding a new one
      if (!lastUser.dui && !lastUser.correo) {
        Swal.fire("Advertencia", "Complete el usuario actual antes de agregar otro.", "warning");
        return;
      }
    }
  
    const newUser = this.createUsuarioForm();
    usuarios.push(newUser);
  
    console.log(`✅ Added user at index ${usuarios.length - 1}:`, newUser.value);
    console.log(`📌 Current users in Formulario #${index}:`, usuarios.value);
    
    this.cdr.detectChanges();
  }
  
  



  removeUsuario(formularioIndex: number, userIndex: number): void {
    const usuarios = this.getUsuarios(this.formularios.at(formularioIndex) as FormGroup);
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

  private buildFormData(): any {
    const formulario = this.solicitudForm.value;
  
    console.log("🔍 Form Data Before Sending:", JSON.stringify(formulario, null, 2));
  
    if (!formulario.formularios || formulario.formularios.length === 0) {
      console.error("❌ Error: No formularios found.");
      return {};
    }
  
    // ✅ Get the applicant (who is sending the request)
    const applicantData = formulario.formularios[0].form || {};
    const currentUserLogin = this.localStorageService.getItem<{ value: string }>('tipo-usuario')?.value || 'NA';
  
    // ✅ Generate the request array for multiple users
    const requests = formulario.formularios.map((f: any, formIndex: number) => {
      const usuarios = f.usuarios || [];
  
      return {
        id: "Pendiente de guardar",
        typeRequest: {
          id: f.tipo,
          value: "Nuevo Usuario",
          status: null
        },
        state: "PENDIENTE DE ASIGNAR",
        createBy: currentUserLogin,
        createOn: Date.now().toString(),
  
        // ✅ Convert users into the correct structure
        person: usuarios.map((user: any) => ({
          document: user.document || "NA",
          surName: user.surName || "NA",
          lastName: user.lastName || "NA",
          uid: user.uid || "NA",
          mail: user.mail || "unknown@example.com",
          phoneNumber: user.phoneNumber || '',
          mobile: user.mobile || '',
          fullName: `${user.surName || ''} ${user.lastName || ''}`.trim(),
          organizationCode: "DGA Externo",
          state: "PENDING",
          userType: user.userType || "Externo",
  
          // ✅ Nested Attributes
          position: user.position || {},
          levelOne: user.levelOne || {},
          levelTwo: user.levelTwo || {},
          levelThree: user.levelThree || {},
          levelFour: user.levelFour || {},
          attribute: user.attribute || {},
          typeAFPA: user.typeAFPA || {},
  
          // ✅ Resolutions (if AFPA)
          resolution: user.resolution || null,
          approveAFPA: user.approveAFPA || null,
        })),
  
        // ✅ Assigned Systems
        systems: usuarios.flatMap((user: any) =>
          (user.systems || []).map((sistema: any) => ({
            id: sistema.id || "CATSYS-12",
            status: "PENDIENTE DE ASIGNAR",
            type: "Externo",
            startDate: sistema.startDate || Date.now().toString(),
            endDate: sistema.endDate || Date.now().toString(),
            group: {
              id: "CATGRP-78",
              status: "ENABLED",
              value: "PAGOES",
              system: null
            },
            custom: {}
          }))
        )
      };
    });
  
    // ✅ Construct final payload
    return {
      id: "NA",
      status: "PENDING",
      createdOn: Date.now().toString(),
      createdBy: currentUserLogin,
      modifiedOn: Date.now().toString(),
      modifiedBy: currentUserLogin,
      closed: false,
      step: "-",
      requests: requests,
  
      // ✅ Applicant information
      applicant: {
        document: applicantData.document || "NA",
        name: applicantData.nombre || "Unknown",
        mail: applicantData.mail || "unknown@example.com",
        externalType: {
          id: "PERSONAL",
          status: "ENABLED",
          value: "Persona Natural"
        },
        position: applicantData.position || {},
        attribute: applicantData.attribute || {},
        externalRepLegal: "N/A",
        externalCodeDeclarant: "N/A",
        id: applicantData.uid || "NA"
      },
      applicantViewer: "-",
      file1: "",
      file2: "",
      file3: "",
      file4: "",
      file5: "",
      file6: ""
    };
  }

  async enviarFormulario(): Promise<void> {
    try {
      // ✅ Ensure all form updates are done
      this.cdr.detectChanges();
  
      Swal.fire({ title: 'Procesando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
  
      const formData = this.buildFormData();
  
      console.log("🚀 FINAL FORM DATA TO BE SENT:", JSON.stringify(formData, null, 2));
  
      const formResponse = await this.procesoFormulario.iniciarProceso(formData);
  
      Swal.fire('Éxito', 'El formulario ha sido enviado exitosamente.', 'success');
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un problema al enviar el formulario.', 'error');
    }
  }
  


  
  
}
