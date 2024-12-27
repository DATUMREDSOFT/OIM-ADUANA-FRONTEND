import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MaterialModule } from '../../../material.module';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-afpa',
  templateUrl: './solicitud-afpa.component.html',
  standalone: true,
  imports: [MaterialModule, MatCardModule, CommonModule, MatNativeDateModule, FormsModule, ReactiveFormsModule],
})
export class AppSolicitudAfpaComponent {
  @ViewChild('stepper') stepper: MatStepper;

  usuariosFormGroup: FormGroup;
  revisionFormGroup: FormGroup;
  solicitudForm: FormGroup;
  userRequests: any[] = [];

  userType: string = '';
  generatedUser: string = '';
  afpaData = {
    nombre: 'EDGARD ARMANDO GARCIA AMAYA',
    direccion: '123 Main St',
    telefono: '555-555-5555',
    correo: 'example@example.com'
  };
  isFirstRequest: boolean = true;
  isLoading: boolean = false;

  constructor(private _formBuilder: FormBuilder) {
    this.usuariosFormGroup = this._formBuilder.group({
      userType: ['', Validators.required],
      generatedUser: [{ value: '', disabled: true }],
      requestReason: ['', Validators.required],
      attachment: ['']
    });
    this.revisionFormGroup = this._formBuilder.group({});
  }

  ngOnInit() {

    this.solicitudForm = this._formBuilder.group({

      userType: ['']

    });

  }

  onUserTypeChange(event: any) {
    this.isLoading = true;
    this.generatedUser = '';
    this.usuariosFormGroup.get('generatedUser')?.setValue('');
    this.usuariosFormGroup.get('attachment')?.setValue('');
    this.userType = event.value;

    // Update the form control value and mark it as touched to trigger validation
    this.usuariosFormGroup.get('userType')?.setValue(this.userType);
    this.usuariosFormGroup.get('userType')?.markAsTouched();
    this.usuariosFormGroup.get('userType')?.updateValueAndValidity();



    // Simulate backend search
    setTimeout(() => {
      this.isLoading = false;
      if (this.userType === 'digitador') {
        this.generatedUser = `DIG-${Math.floor(1000 + Math.random() * 9000)}`;
        this.usuariosFormGroup.get('generatedUser')?.setValue(this.generatedUser);
      } else if (this.userType === 'webservice') {
        this.generatedUser = `WS-${Math.floor(1000 + Math.random() * 9000)}`;
        this.usuariosFormGroup.get('generatedUser')?.setValue(this.generatedUser);
      }
      this.usuariosFormGroup.get('generatedUser')?.updateValueAndValidity();
    }, 2000);
  }

  addUserRequest() {
    if (!this.usuariosFormGroup.get('userType')?.value) {
      Swal.fire('Error', 'Debe seleccionar un tipo de usuario', 'error');
      return;
    }

    if (this.usuariosFormGroup.get('requestReason')?.invalid) {
      Swal.fire('Error', 'El campo "Justificacion" debe ser llenado', 'error');
      return;
    }

    const userRequest = this.usuariosFormGroup.value;
    this.userRequests.push(userRequest);
    this.resetForm();
    Swal.fire('Éxito', 'El usuario ha sido añadido', 'success');
  }

  resetForm() {
    this.usuariosFormGroup.reset();
    this.usuariosFormGroup.get('userType')?.setValue('');
    this.usuariosFormGroup.get('generatedUser')?.setValue('');
  }

  saveAsDraft() {
    // Logic to save as draft
  }

  sendRequest() {
    // Logic to send request
  }

  addUser() {
    // Logic to add another user
  }
}