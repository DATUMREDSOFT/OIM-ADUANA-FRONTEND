import {Component, input} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-contacto-usuario',
  standalone: true,
  imports: [],
  templateUrl: './contacto-usuario.component.html',
})
export class ContactoUsuarioComponent {
  formGroup = input<FormGroup>();
}
