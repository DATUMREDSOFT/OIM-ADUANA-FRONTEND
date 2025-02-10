import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-solicitud-web-service',
  standalone: true,
  imports: [
    MatButton,
    MatCardContent,
    MatCardHeader,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatHint,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    ReactiveFormsModule
  ],
  templateUrl: './solicitud-web-service.component.html',
  styles: ``
})
export class SolicitudWebServiceComponent implements OnInit {
  formGroup: FormGroup;


  constructor(private fb: FormBuilder) {

  }


  ngOnInit() {
    this.formGroup = this.fb.group({
      duiNit: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      organizacion: [{value: 'DGA', disabled: true}],
      estado: ['', Validators.required],
      tipoUsuario: [{value: 'seleccione uno', disabled: true}],
      accesos: [{value: 'SIAPA', disabled: true}],
      perfil: [''],
      aduanaPerfil: [''],
      rol: [{value: '', disabled: true}],
      cargo: [{value: '', disabled: true}],
      movil: ['', Validators.required],
      correoAlternativo: ['', Validators.required],
      nivel1: {value: '', disabled: true},
      nivel2: {value: '', disabled: true},
      nivel3: {value: '', disabled: true},
      nivel4: {value: '', disabled: true},
    });
  }


  fetchUserData() {

  }
}
