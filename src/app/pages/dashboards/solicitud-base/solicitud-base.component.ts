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
      dui: [{ value: '', disabled: false }],
      uid: [{ value: '', disabled: true }],
      nombre:[{ value: '', disabled: true }],
      apellido: [{ value: '', disabled: true }],
      correo: [{ value: '', disabled: true }, Validators.required], // ✅ Starts disabled
      telefono: [{ value: '', disabled: true }, Validators.email], // ✅ Starts disabled
      movil: [{ value: '', disabled: true }, Validators.required], // ✅ Starts disabled
      correoAlternativo: ['', Validators.email],
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
      sistema: [''], // This will be populated from the child component
      fechaInicioSistema: [''],
      fechaFinSistema: [''],
      perfil: [''],
      aduanaPerfil: [''],
      fechaInicioPerfil: [''],
      fechaFinPerfil: [''],
      sistemas: this.fb.array([]) // This will be populated from the child component
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
    console.log('🛠️ addUsuario called for form index:', index);

    const formulario = this.formularios.at(index) as FormGroup;

    // 🔥 Fix: Ensure usuarios exists
    if (!formulario.get('usuarios')) {
        console.warn("⚠️ 'usuarios' array not found in form, initializing...");
        formulario.setControl('usuarios', this.fb.array([]));
    }

    const usuarios = formulario.get('usuarios') as FormArray;
    if (!usuarios) {
        console.error("❌ `usuarios` array not found in form after creation.");
        return;
    }

    const newUser = this.createUsuarioForm();
    usuarios.push(newUser);

    console.log(`✅ Added user at index ${usuarios.length - 1}:`, newUser.value);
    
    this.cdr.detectChanges();
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

  private buildFormData(): FormularioExterno {
    const formulario = this.solicitudForm.value;

    console.log("🔍 Form Data Before Building JSON:", JSON.stringify(formulario, null, 2));

    if (!formulario.formularios || formulario.formularios.length === 0) {
        console.error("❌ Error: No formularios found.");
        return {} as FormularioExterno;
    }

    // ✅ Extract applicant data
    const applicantData = formulario.formularios?.[0]?.form || {};
    if (!applicantData) {
        console.error("❌ Error: Applicant data is missing.");
    }

    const userType = this.localStorageService.getItem<{ value: string }>('tipo-usuario')?.value || 'NOAFPA';
    const currentUserLogin = (userType === "AFPA" || userType === "INTERNO") ? this.procesoFormulario.getUserLogin() : "NA";

    const requests = formulario.formularios.map((f: any, formIndex: number) => {
        const usuarios = f.usuarios || [];
        console.log(`🔍 Form ${formIndex} has ${usuarios.length} users.`);

        return {
            status: "PENDING",
            id: "Pendiente de guardar",
            typeRequest: { id: f.tipo, value: "Nuevo Usuario" },
            state: "PENDING",
            createBy: currentUserLogin,
            createOn: Date.now().toString(),
            profiles: userType === "AFPA" ? f.usuarios.flatMap((user: any) => user.perfiles || []) : [],
            systems: f.usuarios.flatMap((user: any) =>
                (user.sistemas || []).map((sistema: any) => ({
                    id: sistema.id || "CATSYS-12",
                    status: "PENDIENTE DE ASIGNAR",
                    startDate: sistema.fechaInicioSistema || Date.now().toString(),
                    endDate: sistema.fechaFinSistema || Date.now().toString(),
                    group: { id: "CATGRP-78", value: "PAGOES", status: "ENABLED" },
                    custom: { id: "NA", value: "N/A" }
                }))
            ),
            person: usuarios.map((user: any, userIndex: number) => {
                console.log(`🔍 User ${userIndex} inside Form ${formIndex}:`, user);
                return {
                    document: user.dui || "NA",
                    surName: user.nombre || "NA",
                    lastName: user.apellido || "NA",
                    uid: user.uid || "NA",
                    mail: user.correo || "unknown@example.com",
                    phoneNumber: user.telefono || '',
                    mobile: user.movil || '',
                    fullName: `${user.nombre || ''} ${user.apellido || ''}`.trim(),
                    organizationCode: "DGA Externo",
                    state: "PENDING",
                    userType: "Externo",
                };
            })
        };
    });

    console.log("🚀 FINAL FORM DATA TO BE SENT:", JSON.stringify(requests, null, 2));

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
        comment: "",
        applicant: {
            document: applicantData.dui || "NA",
            name: applicantData.nombre || "Unknown",
            mail: applicantData.correo || "unknown@example.com",
            externalType: {
                id: "PERSONAL",
                status: "ENABLED",
                value: "Persona Natural"
            },
            position: {
                id: "NA",
                value: applicantData.cargo || "Unknown",
                status: "ENABLED"
            },
            attribute: {
                id: "NA",
                value: "N/A",
                status: "ENABLED"
            },
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
        file6: "",
    };
}



async enviarFormulario(): Promise<void> {
  try {
    Swal.fire({ title: 'Procesando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const formData = this.buildFormData();

    // 🔥 Debugging: Check JSON before sending
    console.log("🚀 FINAL FORM DATA TO BE SENT:", JSON.stringify(formData, null, 2));

    const formResponse = await this.procesoFormulario.iniciarProceso(formData);

    Swal.fire('Éxito', 'El formulario ha sido enviado exitosamente.', 'success');
  } catch (error) {
    Swal.fire('Error', 'Ocurrió un problema al enviar el formulario.', 'error');
  }
}


  
  
}
