import { Component, ViewChild, OnInit } from '@angular/core';
// import { MatStepper } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';
import { MatAccordion } from '@angular/material/expansion';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';

import { Inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AppSolicitudInternoComponent } from "../solicitud-interno/solicitud-interno.component";
import { AppSolicitudAfpaComponent } from "../solicitud-nuevo-afpa/solicitud-afpa.component";
import { AppSolicitudExternoComponent } from "../solicitud-externo/solicitud-externo.component";

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

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.userType = this.userService.getUserType();
    this.solicitudForm = this.fb.group({
      formularios: this.fb.array([this.createFormulario()])
    });
  }

  get formularios(): FormArray {
    return this.solicitudForm.get('formularios') as FormArray;
  }

  createFormulario(): FormGroup {
    return this.fb.group({
      tipo: ['', Validators.required],
      subitems: this.fb.array([])
    });
  }

  addFormulario() {
    this.formularios.push(this.createFormulario());
  }

  removeFormulario(index: number) {
    this.formularios.removeAt(index);
  }

  scrollToForm(index: number) {
    const form = document.getElementById(`form-${index}`);
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }

  sendRequest() {
    console.log(this.solicitudForm.value);
    // Implement the logic to send the form data to the backend
  }
  
}