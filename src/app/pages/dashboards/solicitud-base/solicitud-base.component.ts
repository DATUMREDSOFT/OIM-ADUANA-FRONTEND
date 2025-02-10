import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ProcesoFormularioService } from '../../../services/proceso-formulario.service';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';
import { TipoSolicitud } from '../solicitud-base/models/tipo-solicitud.model';
import { System } from '../solicitud-externo/models/system.model';
import { Profile } from '../solicitud-externo/models/profile.model';
import { Aduana } from '../../../models/aduana.model';
import { UserService } from '../../../services/user.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { TiposSolicitudService } from '../../../services/tipos-solicitud.service';
// import { MatStepper } from '@angular/material/stepper';
import { MaterialModule } from '../../../material.module';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';

import { Inject } from '@angular/core';
import { AppSolicitudInternoComponent } from "../solicitud-interno/solicitud-interno.component";
import { AppSolicitudAfpaComponent } from "../solicitud-nuevo-afpa/solicitud-afpa.component";
import { AppSolicitudExternoComponent } from "../solicitud-externo/solicitud-externo.component";
import { FormServiceService } from "../../../services/form-service.service";
import { TipoUsuarioService } from "../../../services/tipo-usuario.service";
import { ChangeDetectorRef } from '@angular/core';

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

  /** ✅ Load Request Types from Local Storage */
  private loadTiposSolicitudFromStorage(): void {
    let storedData: any;

    // 🔍 Try retrieving using localStorage.getItem() directly
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

    // 🔹 Try using the localStorageService if available
    if (!storedData) {
      storedData = this.localStorageService.getItem('tipo-solicitud');
      console.log("🔍 Retrieved from localStorageService:", storedData);
    }

    // ❌ If still no data, warn
    if (!storedData || !storedData.value || !Array.isArray(storedData.value)) {
      console.warn("⚠️ No valid tipos-solicitud found in storage.", storedData);
      return;
    }

    // ✅ Extract the correct data
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
    childComponent: [null], // Stores dynamically loaded component
    form: this.fb.group({ // Ensure form is defined
      uid: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      movil: [''],
      correoAlternativo: [''],
      fechaInicioSolicitud: [''],
      fechaFinSolicitud: [''],
      perfil: ['', Validators.required],
      aduanaPerfil: ['', Validators.required],
      fechaInicioSistema: [''],
      fechaFinSistema: ['']
    }),
    usuarios: this.fb.array([this.createUsuarioForm()]) // Ensure at least one user is created
  });
}

  
  // ✅ Create a new `usuario` FormGroup
  private createUsuarioForm(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required], 
      apellido: ['', Validators.required], 
      telefono: ['', Validators.required], 
      movil: [''], 
      correo: ['', [Validators.required, Validators.email]], 
      correoAlternativo: [''], 
      fechaInicioSolicitud: [''], 
      fechaFinSolicitud: [''],
      perfil: ['', Validators.required], 
      aduanaPerfil: ['', Validators.required], 
      fechaInicioSistema: [''], 
      fechaFinSistema: [''],
      sistemas: this.fb.array([this.createDefaultSistema()]) // ✅ Initialize with default system
    });
  }
  
  
  // ✅ Add SIAP System Automatically (deactivated by default)
  private createDefaultSistema(): FormGroup {
    return this.fb.group({
      nombre: ['SIAP'], // Predefined system name
      estado: ['deactivated'] // Automatically disabled
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
  /** ✅ Submit Multiple Users */
  async enviarFormulario() {
    if (this.solicitudForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios', 'error');
      return;
    }

    // ✅ Now each formulario contains multiple usuarios (subitems)
    const formData = this.solicitudForm.value.formularios.map((form: any) => ({
      tipo: form.tipo,
      formType: this.userService.getTipoUsuario(),
      usuarios: form.usuarios.map((usuario: any) => ({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        movil: usuario.movil,
        correo: usuario.correo,
        correoAlternativo: usuario.correoAlternativo,
        fechaInicioSolicitud: usuario.fechaInicioSolicitud,
        fechaFinSolicitud: usuario.fechaFinSolicitud,
        perfil: usuario.perfil,
        aduanaPerfil: usuario.aduanaPerfil,
        fechaInicioSistema: usuario.fechaInicioSistema,
        fechaFinSistema: usuario.fechaFinSistema,
        sistema: usuario.sistema, // ✅ SIAP is prefilled
      }))
    }));

    try {
      const response = await this.procesoFormulario.iniciarProceso(formData[0]);
      if (response) {
        Swal.fire('Éxito', 'El formulario se ha enviado correctamente', 'success');
      }
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un problema al enviar el formulario', 'error');
    }
  }

  // ✅ Ensure that each 'usuario' retrieved is cast to a FormGroup
  getUsuarioForm(formulario: FormGroup, index: number): FormGroup {
    return this.getUsuarios(formulario).at(index) as FormGroup;
  }

  // ✅ Get the `usuarios` FormArray safely
getUsuarios(formulario: FormGroup): FormArray {
  return formulario.get('usuarios') as FormArray;
}

// ✅ Add a new user to a specific form
addUsuario(index: number): void {
  this.getUsuarios(this.formularios.at(index) as FormGroup).push(this.createUsuarioForm());
}

// ✅ Remove a user from a specific form
removeUsuario(formIndex: number, userIndex: number): void {
  const usuarios = this.getUsuarios(this.formularios.at(formIndex) as FormGroup);
  if (usuarios.length > 1) {
    usuarios.removeAt(userIndex);
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
        text: 'Esta acción eliminará el formulario seleccionado',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.formularios.removeAt(index);
          Swal.fire('Eliminado', 'El formulario ha sido eliminado', 'success');
        }
      });
    }
  }

  updateSelectedTipoSolicitud(index: number) {
    const formulario = this.formularios.at(index);
    const selectedTipo = formulario.get('tipo')?.value;

    if (!selectedTipo) return;
    console.log(`🟢 Tipo de solicitud seleccionado: ${selectedTipo}`);

    let componentToLoad = null;
    switch (selectedTipo) {
      case 'TYREQ-1': componentToLoad = 'externo'; break;
      case 'TYREQ-2': componentToLoad = 'interno'; break;
      case 'TYREQ-3': componentToLoad = 'afpa'; break;
      default:
        console.warn("⚠️ Tipo de solicitud no reconocido:", selectedTipo);
    }

    // Ensure Angular detects the change
    formulario.patchValue({ childComponent: null });

    setTimeout(() => {
      formulario.patchValue({ childComponent: componentToLoad });
      this.cdr.detectChanges(); // ✅ Force UI refresh
    }, 0);
  }


  /** ✅ Scroll to a Specific Form */
  scrollToForm(index: number) {
    const form = document.getElementById(`form-${index}`);
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }
}