import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Injectable({
  providedIn: 'root'
})
export class FormServiceService {


  private form!: FormGroup;

  constructor(private fb: FormBuilder) {

  }


  initForm() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      movil: ['', Validators.required],
      telefono: ['', Validators.required],
      correoAlternativo: [''],
      accesos: [{value: 'SIAPA', disabled: true}],
      perfil: [''],
      aduanaPerfil: [''],
      fechaInicioSolicitud: [new Date().toISOString().split('T')[0], Validators.required],
      fechaFinSolicitud: ['', Validators.required],
      fechaInicioSistema: [new Date().toISOString().split('T')[0], Validators.required],
      fechaFinSistema: ['', Validators.required]
    })
  }


  getForm() {
    return this.form;
  }


}
