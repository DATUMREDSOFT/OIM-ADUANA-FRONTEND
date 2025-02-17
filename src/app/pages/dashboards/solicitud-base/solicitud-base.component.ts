import {Component, OnInit, SimpleChanges, inject, ViewChild, ElementRef} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  FormGroupDirective
} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {TablerIconsModule} from 'angular-tabler-icons';
import {ChangeDetectorRef} from '@angular/core';
import {lastValueFrom} from 'rxjs';
import Swal from 'sweetalert2';

import {ApiService} from '../../../services/api.service';
import {ProcesoFormularioService} from '../../../services/proceso-formulario.service';
import {UserService} from '../../../services/user.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {TiposSolicitudService} from '../../../services/tipos-solicitud.service';
import {FormServiceService} from "../../../services/form-service.service";
import {TipoUsuarioService} from "../../../services/tipo-usuario.service";

import {TipoSolicitud} from '../solicitud-base/models/tipo-solicitud.model';
import {System} from '../solicitud-externo/models/system.model';
import {Profile} from '../solicitud-externo/models/profile.model';
import {Aduana} from '../../../models/aduana.model';
import {FormularioExterno} from '../solicitud-externo/models/formulario-externo.model';

import {MaterialModule} from '../../../material.module';
import {AppSolicitudInternoComponent} from "../solicitud-interno/solicitud-interno.component";
import {AppSolicitudAfpaComponent} from "../solicitud-nuevo-afpa/solicitud-afpa.component";
import {AppSolicitudExternoComponent} from "../solicitud-externo/solicitud-externo.component";
import {Roles} from '../../../enums/roles.enum';

@Component({
  selector: 'app-solicitud-base',
  templateUrl: './solicitud-base.component.html',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatCardModule, MatNativeDateModule, MatExpansionModule, TablerIconsModule, ReactiveFormsModule, AppSolicitudExternoComponent, AppSolicitudInternoComponent, AppSolicitudAfpaComponent],
})
export class AppSolicitudBaseComponent implements OnInit {
  solicitudForm: FormGroup;
  tiposSolicitud: TipoSolicitud[] = [];
  sistemas: System[] = [];
  perfiles: Profile[] = [];
  aduanas: Aduana[] = [];
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly procesoFormulario = inject(ProcesoFormularioService);
  private readonly userService = inject(UserService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly cdr = inject(ChangeDetectorRef);


  // upload file
  @ViewChild('fileInput') fileInput: ElementRef;
  selectedFile: File | null = null;

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


  constructor() {
    this.solicitudForm = this.fb.group({
      formularios: this.fb.array([this.createFormulario()])
    });
  }

  ngOnInit(): void {
    this.loadTiposSolicitudFromStorage();
    this.obtenerSistemas();
    this.obtenerPerfiles();
    this.obtenerAduanas();
  }

  /** ✅ Get FormArray */
  get formularios(): FormArray {
    return this.solicitudForm.get('formularios') as FormArray;
  }

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  getUserIndex(formIndex: number, userIndex: number): number {
    return userIndex;
  }


  /** ✅ Load Request Types from Local Storage */
  private loadTiposSolicitudFromStorage(): void {
    let storedData: any;

    const rawStoredData = localStorage.getItem('tipos-solicitud');
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

  /** ✅ Create a new Formulario */
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
        aduanaPerfil: [''],
        fechaInicioSistema: [''],
        fechaFinSistema: ['']
      }),
      usuarios: this.fb.array([])
    });
  }

  /** ✅ Create a new `usuario` FormGroup */
  private createUsuarioForm(): FormGroup {
    return this.fb.group({
      nombre: [''],
      apellido: [''],
      telefono: [''],
      movil: [''],
      correo: [''],
      correoAlternativo: [''],
      fechaInicioSolicitud: [''],
      fechaFinSolicitud: [''],
      sistema: [''],
      aduanaPerfil: [''],
      fechaInicioSistema: [''],
      fechaFinSistema: [''],
      sistemas: this.fb.array([this.createDefaultSistema()])
    });
  }

  /** ✅ Add SIAP System Automatically (deactivated by default) */
  private createDefaultSistema(): FormGroup {
    return this.fb.group({
      nombre: ['SIAP'],
      estado: ['deactivated']
    });
  }

  /** ✅ Generate UID based on First & Last Name */
  generateUID(index: number) {
    const formulario = this.formularios.at(index);
    const nombres = formulario.get('form.nombres')?.value.trim().split(' ')[0] || '';
    const apellidos = formulario.get('form.apellidos')?.value.trim().split(' ')[0] || '';
    const uid = `${nombres.toLowerCase()}.${apellidos.toLowerCase()}`;
    formulario.get('form.uid')?.setValue(uid);
  }

  /** ✅ Fetch External Systems */
  async obtenerSistemas() {
    try {
      const response = await lastValueFrom(this.apiService.request<System[]>('GET', 'dga/form/request/list/ext/system'));
      this.sistemas = response;
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los sistemas', 'error');
    }
  }

  /** ✅ Fetch User Profiles */
  async obtenerPerfiles() {
    try {
      const userType = this.userService.getTipoUsuario();
      const response = await lastValueFrom(this.apiService.request<Profile[]>('GET', `dga/form/request/list/profile/${userType}`));
      this.perfiles = response;
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los perfiles', 'error');
    }
  }

  /** ✅ Fetch Customs (Aduanas) */
  async obtenerAduanas() {
    try {
      const response = await lastValueFrom(this.apiService.request<Aduana[]>('GET', 'dga/form/request/list/customs'));
      this.aduanas = response;
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las aduanas', 'error');
    }
  }

  /** ✅ Send Form Request */
  async enviarFormulario() {
    if (this.solicitudForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios', 'error');
      return;
    }

    const currentTimestamp = new Date().getTime().toString();

    const formData: FormularioExterno = {
      id: '',
      createdOn: new Date().toISOString(),
      createdBy: this.procesoFormulario.getUserLogin() ?? 'NA',
      modifiedOn: new Date().toISOString(),
      modifiedBy: this.procesoFormulario.getUserLogin() ?? 'NA',
      closed: false,
      step: "-",
      comment: 'Solicitud generada desde Angular 18',
      applicantViewer: '-',
      file1: '',
      file2: '',
      file3: '',
      file4: '',
      file5: '',
      file6: '',
      status: 'PENDING',
      createdName: 'Solicitante',
      formType: this.userService.getTipoUsuario() === Roles.INTERNO ? 'Interno' : 'Externo',

      applicant: {
        id: '',
        document: "123456789",
        position: {
          id: '',
          value: ''
        },
        attribute: {
          id: '',
          value: ''
        },
        externalType: {
          id: "PERSONAL",
          status: "ENABLED",
          value: "Persona Natural"
        },
        name: "John Doe",
        externalName: "John Doe",
        mail: "john.doe@example.com",
        externalRepLegal: '',
        externalCodeDeclarant: ''
      },

      requests: this.formularios.value.map((form: any) => ({
        id: "",
        typeRequest: {
          id: form.tipo,
          value: "Nuevo Usuario",
          status: null
        },
        state: "PENDIENTE DE ASIGNAR",
        createBy: this.procesoFormulario.getUserLogin() ?? 'NA',
        createOn: Date.now().toString(),
        profiles: form.usuarios?.length ? form.usuarios : {},
        resources: {},
        systems: form.usuarios.flatMap((usuario: any) => usuario.sistemas.map((sistema: any) => ({
          id: "",
          status: "PENDIENTE DE ASIGNAR",
          type: "Externo",
          startDate: Date.now().toString(),
          group: {
            id: "CATGRP-78",
            status: "ENABLED",
            value: "PAGOES",
            system: null
          },
          custom: {}
        }))),
        others: {},
        flow: {}
      }))
    };

    console.log("✅ Fixed Request:", formData);

    try {
      const response = await this.procesoFormulario.iniciarProceso(formData);
      if (response) {
        Swal.fire('Éxito', 'El formulario se ha enviado correctamente', 'success');
      }
    } catch (error) {
      const errorMessage = (error as any).message || 'Error desconocido';
      Swal.fire('Error', 'Ocurrió un problema al enviar el formulario: ' + errorMessage, 'error');
    }
  }

  /** ✅ Ensure that each 'usuario' retrieved is cast to a FormGroup */
  getUsuarioForm(formulario: AbstractControl, index: number): FormArray {
    return (formulario.get('usuarios') as FormArray);
  }

  /** ✅ Get the `usuarios` FormArray safely */
  getUsuarios(formulario: FormGroup): FormArray {
    return formulario.get('usuarios') as FormArray;
  }

  /** ✅ Add a new user to a specific form */
  addUsuario(index: number): void {
    console.log('addUsuario called'); // Debugging log
    const usuarios = this.getUsuarios(this.formularios.at(index) as FormGroup);
    usuarios.push(this.createUsuarioForm());
    this.cdr.detectChanges(); // Trigger change detection
  }

  /** ✅ Remove a user from a specific form */
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

  /** ✅ Add a new Formulario */
  addFormulario() {
    this.formularios.push(this.createFormulario());
  }

  /** ✅ Remove an Existing Formulario */
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

    if (!selectedTipo) return;

    let componentToLoad = null;
    switch (selectedTipo) {
      case 'TYREQ-1':
        componentToLoad = 'externo';
        break;
      case 'TYREQ-2':
        componentToLoad = 'interno';
        break;
      case 'TYREQ-3':
        componentToLoad = 'afpa';
        break;
      default:
        console.warn("⚠️ Tipo de solicitud no reconocido:", selectedTipo);
    }

    formulario.patchValue({childComponent: componentToLoad});
    this.cdr.detectChanges();
  }

  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const formulario = this.formularios.at(0);
  //     formulario.get('form.file')?.setValue(reader.result);
  //   };
  //   reader.readAsDataURL(file);
  // }

  /** ✅ Scroll to a Specific Form */
  scrollToForm(index: number) {
    const form = document.getElementById(`form-${index}`);
    if (form) {
      form.scrollIntoView({behavior: 'smooth'});
    }
  }
}
