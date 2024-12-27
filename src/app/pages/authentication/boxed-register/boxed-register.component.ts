import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatDialog } from '@angular/material/dialog';
import { AppDeleteRegistryComponent } from '../boxed-register/delete/delete.component';

@Component({
  selector: 'app-boxed-register',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './boxed-register.component.html',
})
export class AppBoxedRegisterComponent {
  options = this.settings.getOptions();
  searchQuery: string = '';
  documentControl: FormControl;
  loading: boolean = false;
  searchCompleted: boolean = false;
  userExists: boolean = false;

  validDuis: string[] = ['00000000-0'];
  userType: string = '';
  userData: any = {};
  authorizedList: any[] = [{ nombre: '', correo: '', telefono: '', direccion: '', dui: '' }];

  addPersonal() {
    this.authorizedList.push({ nombre: '', correo: '', telefono: '', direccion: '', dui: '' });
    setTimeout(() => {
      const element = document.getElementById('.scrollable-container');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }

  confirmDelete(index: number) {
    const dialogRef = this.dialog.open(AppDeleteRegistryComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deletePersonal(index);
      }
    });
  }

  deletePersonal(index: number) {
    this.authorizedList.splice(index, 1);
  }
  

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });


  get f() {
    return this.form.controls;
  }

  submit() {
    // console.log(this.form.value);
    this.router.navigate(['/dashboards/dashboard1']);
  }


ngOnInit() {
  this.documentControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{8}-\d{1}$|^\d{4}-\d{6}-\d{3}-\d{1}$/)
  ]);
}
constructor(private settings: CoreService, private router: Router, private dialog: MatDialog) {
  // Dummy data for testing
  this.validDuis.push('12345678-9'); // Natural Person
  this.validDuis.push('1234-567890-123-4'); // Company
  this.validDuis.push('5678-123456-789-0'); // Customs Agent
  this.validDuis.push('98765432-1'); // Customs Agent
}

// Removed duplicate onSearch function

  onSearch() {
    if (this.documentControl.invalid) {
      this.documentControl.markAsTouched();
      return;
    }
    this.loading = true;
    // Simulate an API call
    setTimeout(() => {
      this.loading = false;
      this.searchCompleted = true;
      // Simulate user existence check
      this.userExists = this.validDuis.includes(this.documentControl.value);
      if (this.userExists) {
        if (this.documentControl.value === '12345678-9') {
          this.userType = 'naturalPerson';
          this.userData = {
            nombre: 'John Doe',
            correo: 'john.doe@example.com',
            telefono: '12345678'
          };
        } else if (this.documentControl.value === '1234-567890-123-4') {
          this.userType = 'company';
          this.userData = {
            nombre: 'ABC Corp',
            direccion: '123 Business St',
            telefono: '87654321',
            correo: 'contact@abccorp.com'
          };
        } else if (this.documentControl.value === '98765432-1') {
          this.userType = 'customsAgent';
          this.userData = {
            nombre: 'Jane Smith',
            correo: 'jane.smith@example.com',
            telefono: '11223344',
            codigoDeclarante: 'A123456'
          };
        } else if (this.documentControl.value === '00000000-0') {
          alert('Este usuario ya tiene cuenta. Redireccionando a login');
          setTimeout(() => {
            this.router.navigate(['/authentication/boxed-login']);
          }, 2000);
          return;
        }
      } else {
        setTimeout(() => {
          this.router.navigate(['/authentication/boxed-register']);
        }, 2000);
      }
    }, 2000);
  }

  formatDocument() {
    let value = this.documentControl.value.replace(/\D/g, ''); // Remove non-digit characters

    if (value.length > 14) {
      value = value.substring(0, 14); // Limit to 14 digits
    }

    if (value.length <= 9) {
      // Format as DUI
      this.documentControl.setValue(value.replace(/(\d{8})(\d{1})/, '$1-$2'), { emitEvent: false });
    } else {
      // Format as NIT
      this.documentControl.setValue(value.replace(/(\d{4})(\d{6})(\d{3})(\d{1})/, '$1-$2-$3-$4'), { emitEvent: false });
    }
  }

  toggleCollapse(index: number) {
    const content = document.getElementById(`content-${index}`);
    const icon = document.getElementById(`icon-${index}`);
    if (content) {
      if (content.style.display === "none") {
        content.style.display = "block";
        if (icon) {
          icon.innerText = "expand_less";
        }
      } else {
        content.style.display = "none";
        if (icon) {
          icon.innerText = "expand_more";
        }
      }
    }
  }
}


