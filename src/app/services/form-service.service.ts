import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

export interface BaseFormulario {
  toFormGroup(fb: FormBuilder): FormGroup;
}


export class FormularioExterno implements BaseFormulario {
  nombre = '';
  apellido = '';
  correo = '';
  movil = '';
  telefono = '';
  correoAlternativo = '';
  perfil = '';
  aduanaPerfil = '';
  fechaInicioSolicitud = new Date().toISOString().split('T')[0];
  fechaFinSolicitud = '';
  fechaInicioSistema = new Date().toISOString().split('T')[0];
  fechaFinSistema = '';

  toFormGroup(fb: FormBuilder): FormGroup {
    return fb.group({
      nombre: [this.nombre, Validators.required],
      apellido: [this.apellido, Validators.required],
      correo: [this.correo, [Validators.required, Validators.email]],
      movil: [this.movil],
      telefono: [this.telefono],
      correoAlternativo: [this.correoAlternativo],
      perfil: [this.perfil],
      aduanaPerfil: [this.aduanaPerfil],
      fechaInicioSolicitud: [this.fechaInicioSolicitud, Validators.required],
      fechaFinSolicitud: [this.fechaFinSolicitud, Validators.required],
      fechaInicioSistema: [this.fechaInicioSistema, Validators.required],
      fechaFinSistema: [this.fechaFinSistema, Validators.required],
    });
  }
}

export class FormularioInterno implements BaseFormulario {
  dui = '';
  nombre = '';
  apellido = '';
  usuario = '';
  correo = '';
  telefono = '';
  correoAlternativo = '';
  movil = '';
  organizacion = '';
  tipoUsuario = '';
  rol = '';
  cargo = '';
  nivel1 = '';
  nivel2 = '';
  nivel3 = '';
  nivel4 = '';
  perfil = '';
  aduanaPerfil = '';
  fechaInicioSolicitud = new Date().toISOString().split('T')[0];
  fechaFinSolicitud = '';
  fechaInicioSistema = new Date().toISOString().split('T')[0];
  fechaFinSistema = '';

  toFormGroup(fb: FormBuilder): FormGroup {
    return fb.group({
      dui: [this.dui, Validators.required],
      nombre: [this.nombre, Validators.required],
      apellido: [this.apellido, Validators.required],
      usuario: [this.usuario, Validators.required],
      correo: [this.correo, [Validators.required, Validators.email]],
      telefono: [this.telefono],
      correoAlternativo: [this.correoAlternativo],
      movil: [this.movil],
      organizacion: [this.organizacion, Validators.required],
      tipoUsuario: [this.tipoUsuario, Validators.required],
      rol: [this.rol, Validators.required],
      cargo: [this.cargo],
      nivel1: [this.nivel1],
      nivel2: [this.nivel2],
      nivel3: [this.nivel3],
      nivel4: [this.nivel4],
      perfil: [this.perfil],
      aduanaPerfil: [this.aduanaPerfil],
      fechaInicioSolicitud: [this.fechaInicioSolicitud, Validators.required],
      fechaFinSolicitud: [this.fechaFinSolicitud, Validators.required],
      fechaInicioSistema: [this.fechaInicioSistema, Validators.required],
      fechaFinSistema: [this.fechaFinSistema, Validators.required],
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {


  private form!: FormGroup;

  constructor(private fb: FormBuilder) {

  }


  initForm(tipo: string) {
    if (tipo === 'TYREQ-1' || tipo === 'TYREQ-2') {
      const formExterno = new FormularioExterno();
      this.form = formExterno.toFormGroup(this.fb);
    } else {
      const formInterno = new FormularioInterno();
      this.form = formInterno.toFormGroup(this.fb);
    }
  }


  getForm() {
    return this.form;
  }


}
