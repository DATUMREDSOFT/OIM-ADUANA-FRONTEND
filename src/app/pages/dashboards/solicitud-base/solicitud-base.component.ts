import {Component, ViewChild, OnInit} from '@angular/core';
// import { MatStepper } from '@angular/material/stepper';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormArray} from '@angular/forms';
import {MaterialModule} from '../../../material.module';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {MatNativeDateModule} from '@angular/material/core';
import {lastValueFrom} from 'rxjs';
import Swal from 'sweetalert2';
import {MatAccordion} from '@angular/material/expansion';
import {MatExpansionModule} from '@angular/material/expansion';
import {DatePipe} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// icons
import {TablerIconsModule} from 'angular-tabler-icons';

import {Inject} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {AppSolicitudInternoComponent} from "../solicitud-interno/solicitud-interno.component";
import {AppSolicitudAfpaComponent} from "../solicitud-nuevo-afpa/solicitud-afpa.component";
import {AppSolicitudExternoComponent} from "../solicitud-externo/solicitud-externo.component";
import {FormServiceService} from "../../../services/form-service.service";
import {TiposSolicitudService} from "../../../services/tipos-solicitud.service";
import {ApiService} from "../../../services/api.service";
import {TipoUsuarioService} from "../../../services/tipo-usuario.service";

@Component({
  selector: 'app-solicitud-base',
  templateUrl: './solicitud-base.component.html',
  standalone: true,
  providers: [UserService],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, MatCardModule, MatNativeDateModule, MatExpansionModule, TablerIconsModule, AppSolicitudInternoComponent, AppSolicitudAfpaComponent, AppSolicitudExternoComponent],
})
export class AppSolicitudBaseComponent implements OnInit {
  private apiUrl = 'https://tu-api.com/dga/form';
  userType: string;
  solicitudForm: FormGroup;
  tiposSolicitud: { id: string; value: string }[] = [];


  constructor(private fb: FormBuilder,
              private userService: UserService,
              private formService: FormServiceService,
              private http: HttpClient,
              private apiService: ApiService,
              private tipoSolicitudService: TiposSolicitudService) {


  }

  ngOnInit() {


    this.userType = this.userService.getTipoUsuario();

    this.tiposSolicitud = this.tipoSolicitudService.getData().map(tipo => ({
      id: tipo.id,
      value: tipo.value
    }));


    this.solicitudForm = this.fb.group({
      formularios: this.fb.array([this.createFormulario()])
    });
  }

  get formularios(): FormArray {
    return this.solicitudForm.get('formularios') as FormArray;
  }

  createFormulario(): FormGroup {

    this.formService.initForm(this.tiposSolicitud[0].id);

    return this.fb.group({
      tipo: ['', Validators.required],
      uuid: [crypto.randomUUID()],
      form: this.formService.getForm(),
    });
  }


  addFormulario() {


    this.formularios.push(this.createFormulario());

    setTimeout(() => {
      this.scrollToForm(this.formularios.length - 1);
    }, 100);

  }

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

  async sendRequest(): Promise<void> {

    if (this.solicitudForm.invalid) {
      await Swal.fire('Error', 'Por favor, completa todos los campos obligatorios.', 'error');
      return;
    }

    const formData = this.solicitudForm.value.formularios.map((form: any) => ({
      tipo: form.tipo,
      uuid: form.uuid,
      applicant: {
        mail: form.form.correo
      },
      formType: 'Interno',
      requests: [{
        profiles: [],
        systems: [],
        others: []
      }]
    }));

    try {
      const response = await lastValueFrom(
        this.apiService.request('POST', 'dga/form', {body: formData[0]})
      );
      Swal.fire('Éxito', 'El formulario ha sido enviado correctamente', 'success');
    } catch (error: any) {
      console.error('Error al enviar el formulario:', error);
      Swal.fire('Error', 'Hubo un problema al enviar el formulario', 'error');
    }

  }


  scrollToForm(index: number) {
    const form = document.getElementById(`form-${index}`);
    if (form) {
      form.scrollIntoView({behavior: 'smooth'});
    }
  }

  protected readonly console = console;


}
