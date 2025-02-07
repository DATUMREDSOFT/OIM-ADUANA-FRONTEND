import {Component, input} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-datos-usuario',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './datos-usuario.component.html',
  styles: ``
})
export class DatosUsuarioComponent {

  formGroup = input<FormGroup>();

}
