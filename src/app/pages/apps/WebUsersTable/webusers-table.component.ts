import { Component, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppAddWebUserComponent } from './add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { WebConfirmationDialogComponent } from './confirmation/confirmation-dialog.component';
import { Router } from '@angular/router';

export interface Employee {
  duiNit: string;
  nombre: string;
  apellido: string;
  correo: string;
  tipoCuenta: string;
  estadoCuenta: string; // New field
}

const employees: Employee[] = [
  {
    duiNit: '12345678-9',
    nombre: 'Johnathan',
    apellido: 'Deo',
    correo: 'johnathan.deo@gmail.com',
    tipoCuenta: 'AFPA',
    estadoCuenta: 'Activa', // New field value
  },
  {
    duiNit: '98765432-1',
    nombre: 'Mark',
    apellido: 'Zukerburg',
    correo: 'mark.zukerburg@gmail.com',
    tipoCuenta: 'AFPA',
    estadoCuenta: 'Inactiva', // New field value
  },
  {
    duiNit: '45678912-3',
    nombre: 'Sam',
    apellido: 'Smith',
    correo: 'sam.smith@gmail.com',
    tipoCuenta: 'AFPA',
    estadoCuenta: 'Activa', // New field value
  },
  {
    duiNit: '78912345-6',
    nombre: 'John',
    apellido: 'Deo',
    correo: 'john.deo@gmail.com',
    tipoCuenta: 'AFPA',
    estadoCuenta: 'Inactiva', // New field value
  },
{
  duiNit: '11223344-5',
  nombre: 'Alice',
  apellido: 'Johnson',
  correo: 'alice.johnson@gmail.com',
  tipoCuenta: 'AFPA',
  estadoCuenta: 'Activa', // New field value
},
{
  duiNit: '22334455-6',
  nombre: 'Bob',
  apellido: 'Brown',
  correo: 'bob.brown@gmail.com',
  tipoCuenta: 'AFPA',
  estadoCuenta: 'Inactiva', // New field value
},
{
  duiNit: '33445566-7',
  nombre: 'Charlie',
  apellido: 'Davis',
  correo: 'charlie.davis@gmail.com',
  tipoCuenta: 'AFPA',
  estadoCuenta: 'Activa', // New field value
},
{
  duiNit: '44556677-8',
  nombre: 'Diana',
  apellido: 'Evans',
  correo: 'diana.evans@gmail.com',
  tipoCuenta: 'AFPA',
  estadoCuenta: 'Inactiva', // New field value
}
];

@Component({
  selector: 'app-webusers-table',
  templateUrl: './webusers-table.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    MatNativeDateModule
  ],
  providers: [DatePipe],
})
export class AppWebUsersTable implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    'duiNit',

    'correo',

    'estadoCuenta', // New column
    'action',
  ];
  isFirstRequest: boolean = false;
  dataSource = new MatTableDataSource(employees);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe, private router: Router) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppEmployeeDialogContentComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  openConfirmationDialog(action: string, obj: any): void {
    const dialogRef = this.dialog.open(WebConfirmationDialogComponent, {
      data: { action, obj },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        if (action === 'Solicitud desactivacion de usuario') {
          this.updateRowData({ ...obj, estadoCuenta: 'Inactiva' });
        } else if (action === 'Solicitud activacion de usuario') {
          this.updateRowData({ ...obj, estadoCuenta: 'Activa' });
        }
      }
    });
  }

  addRowData(row_obj: Employee): void {
    this.dataSource.data.unshift({
      duiNit: row_obj.duiNit,
      nombre: row_obj.nombre,
      apellido: row_obj.apellido,
      correo: row_obj.correo,
      tipoCuenta: row_obj.tipoCuenta,
      estadoCuenta: row_obj.estadoCuenta, // New field
    });
    this.dialog.open(AppAddWebUserComponent);
    this.table.renderRows();
  }

  updateRowData(row_obj: Employee): boolean | any {
    this.dataSource.data = this.dataSource.data.map((value: Employee) => {
      if (value.duiNit === row_obj.duiNit) {
        value.nombre = row_obj.nombre;
        value.apellido = row_obj.apellido;
        value.correo = row_obj.correo;
        value.tipoCuenta = row_obj.tipoCuenta;
        value.estadoCuenta = row_obj.estadoCuenta; // New field
      }
      return value;
    });
  }

  deleteRowData(row_obj: Employee): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: Employee) => {
      return value.duiNit !== row_obj.duiNit;
    });
  }

  redirectToSolicitudNuevoAfpa() {
    this.router.navigate(['/dashboards/solicitudes-interno']);
  }
}

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: 'webusers-table-dialog-content.html',
  providers: [DatePipe],
})
export class AppEmployeeDialogContentComponent {
  action: string;
  local_data: any;
  selectedImage: any = '';
  joiningDate: any = '';
  generatedUser: string = '';
  userType: string = '';
  afpaData: any = {
    nombre: 'AFPA Example',
    direccion: '123 Example Street',
    telefono: '555-1234',
    correo: 'example@afpa.com'
  };
  isFirstRequest: boolean = true;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppEmployeeDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.local_data.DateOfJoining !== undefined) {
      this.joiningDate = this.datePipe.transform(
        new Date(this.local_data.DateOfJoining),
        'yyyy-MM-dd'
      );
    }
    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.local_data.imagePath = reader.result;
    };
  }

  generateUser(): void {
    if (this.userType === 'digitador') {
      this.generatedUser = 'DIG-' + this.local_data.duiNit;
    } else if (this.userType === 'webservice') {
      this.generatedUser = 'WEB-' + this.local_data.duiNit;
    }
  }

  saveAsDraft(): void {
    // Implement save as draft functionality
  }

  sendRequest(): void {
    // Implement send request functionality
  }
}
