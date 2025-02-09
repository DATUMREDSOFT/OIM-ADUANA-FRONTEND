import {Component, ViewChild, OnInit} from '@angular/core';
// import { MatStepper } from '@angular/material/stepper';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormArray} from '@angular/forms';
import {MaterialModule} from '../../../material.module';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {MatNativeDateModule} from '@angular/material/core';
import Swal from 'sweetalert2';
import {MatAccordion} from '@angular/material/expansion';
import {MatExpansionModule} from '@angular/material/expansion';
import {DatePipe} from '@angular/common';

// icons
import {TablerIconsModule} from 'angular-tabler-icons';

import {Inject} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {AppSolicitudInternoComponent} from "../solicitud-interno/solicitud-interno.component";
import {AppSolicitudAfpaComponent} from "../solicitud-nuevo-afpa/solicitud-afpa.component";
import {AppSolicitudExternoComponent} from "../solicitud-externo/solicitud-externo.component";
import {FormServiceService} from "../../../services/form-service.service";
import {TiposSolicitudService} from "../../../services/tipos-solicitud.service";

@Component({
  selector: 'app-solicitud-base',
  templateUrl: './solicitud-base.component.html',
  standalone: true,
  providers: [UserService],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, MatCardModule, MatNativeDateModule, MatExpansionModule, TablerIconsModule, AppSolicitudInternoComponent, AppSolicitudAfpaComponent, AppSolicitudExternoComponent],
})
export class AppSolicitudBaseComponent implements OnInit {
  userType: string;
  solicitudForm: FormGroup;
  tiposSolicitud: { id: string; value: string }[] = [];


  constructor(private fb: FormBuilder,
              private userService: UserService,
              private formService: FormServiceService,
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

    this.formService.initForm();

    return this.fb.group({
      tipo: ['', Validators.required],
      uuid: [crypto.randomUUID()],

    });
  }


  addFormulario() {
    this.formularios.push(this.createFormulario());
  }

  removeFormulario(index: number) {
    this.formularios.removeAt(index);
  }

  sendRequest() {


    console.log(this.solicitudForm.value);
    console.log(this.userType);

    console.log(this.tiposSolicitud);

    // Implement the logic to send the form data to the backend
  }

  scrollToForm(index: number) {
    const form = document.getElementById(`form-${index}`);
    if (form) {
      form.scrollIntoView({behavior: 'smooth'});
    }
  }

  protected readonly console = console;


}
