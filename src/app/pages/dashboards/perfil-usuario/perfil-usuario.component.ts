import {Component, input} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './perfil-usuario.component.html',
  styles: ``
})
export class PerfilUsuarioComponent {

  formGroup = input<FormGroup>()

}
