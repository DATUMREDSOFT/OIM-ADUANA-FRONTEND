import { Component, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppAddUserComponent } from './add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { ConfirmationDialogComponent } from '../basic-table/confirmation/confirmation-dialog.component';
import { Router } from '@angular/router';

export interface Element {
  dga: string;
  tipoSolicitud: string;
  duiNit: string;
  nombre: string;
  apellido: string;
  correo: string;
  estadoSolicitud: string; // New field
}

const BASIC_DATA: Element[] = [
  { dga: 'DGA001', tipoSolicitud: 'Usuario Nuevo', duiNit: '123456789', nombre: 'John', apellido: 'Doe', correo: 'john.doe@example.com', estadoSolicitud: 'pendiente' },
  { dga: 'DGA002', tipoSolicitud: 'Modificar Usuario', duiNit: '987654321', nombre: 'Jane', apellido: 'Smith', correo: 'jane.smith@example.com', estadoSolicitud: 'aprobada' },
  { dga: 'DGA003', tipoSolicitud: 'Usuario Nuevo', duiNit: '456789123', nombre: 'Michael', apellido: 'Johnson', correo: 'michael.johnson@example.com', estadoSolicitud: 'rechazada' },
  { dga: 'DGA004', tipoSolicitud: 'Modificar Usuario', duiNit: '789123456', nombre: 'Emily', apellido: 'Davis', correo: 'emily.davis@example.com', estadoSolicitud: 'finalizado' },
  { dga: 'DGA011', tipoSolicitud: 'Usuario Nuevo', duiNit: '112233445', nombre: 'Alice', apellido: 'Brown', correo: 'alice.brown@example.com', estadoSolicitud: 'pendiente' },
  { dga: 'DGA012', tipoSolicitud: 'Modificar Usuario', duiNit: '998877665', nombre: 'Bob', apellido: 'White', correo: 'bob.white@example.com', estadoSolicitud: 'rechazada' },
  { dga: 'DGA013', tipoSolicitud: 'Usuario Nuevo', duiNit: '223344556', nombre: 'Charlie', apellido: 'Black', correo: 'charlie.black@example.com', estadoSolicitud: 'rechazada' },
  { dga: 'DGA014', tipoSolicitud: 'Modificar Usuario', duiNit: '556677889', nombre: 'David', apellido: 'Green', correo: 'david.green@example.com', estadoSolicitud: 'finalizado' },
  { dga: 'DGA015', tipoSolicitud: 'Usuario Nuevo', duiNit: '667788990', nombre: 'Eve', apellido: 'Blue', correo: 'eve.blue@example.com', estadoSolicitud: 'no iniciado' },
  { dga: 'DGA016', tipoSolicitud: 'Modificar Usuario', duiNit: '778899001', nombre: 'Frank', apellido: 'Yellow', correo: 'frank.yellow@example.com', estadoSolicitud: 'pendiente' },
  { dga: 'DGA017', tipoSolicitud: 'Usuario Nuevo', duiNit: '889900112', nombre: 'Grace', apellido: 'Red', correo: 'grace.red@example.com', estadoSolicitud: 'aprobada' },
  { dga: 'DGA018', tipoSolicitud: 'Modificar Usuario', duiNit: '990011223', nombre: 'Hank', apellido: 'Purple', correo: 'hank.purple@example.com', estadoSolicitud: 'rechazada' },
  { dga: 'DGA019', tipoSolicitud: 'Usuario Nuevo', duiNit: '001122334', nombre: 'Ivy', apellido: 'Orange', correo: 'ivy.orange@example.com', estadoSolicitud: 'finalizado' },
  { dga: 'DGA020', tipoSolicitud: 'Modificar Usuario', duiNit: '112233445', nombre: 'Jack', apellido: 'Pink', correo: 'jack.pink@example.com', estadoSolicitud: 'no iniciado' }
];

@Component({
  selector: 'app-basic-table',
  templateUrl: './basic-table.component.html',
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
export class AppBasicTableComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  searchText: any;
  displayedColumns: string[] = [
    'dga', 'tipoSolicitud', 'duiNit', 'estadoSolicitud'
  ];
  isFirstRequest: boolean = false;
  dataSource = new MatTableDataSource(BASIC_DATA);

  constructor(public dialog: MatDialog, public datePipe: DatePipe, private router: Router) { }

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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
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

  addRowData(row_obj: Element): void {
    this.dataSource.data.unshift({
      dga: row_obj.dga,
      tipoSolicitud: row_obj.tipoSolicitud,
      duiNit: row_obj.duiNit,
      nombre: row_obj.nombre,
      apellido: row_obj.apellido,
      correo: row_obj.correo,
      estadoSolicitud: row_obj.estadoSolicitud
    });
    this.dialog.open(AppAddUserComponent);
    this.table.renderRows();
  }

  updateRowData(row_obj: Element): boolean | any {
    this.dataSource.data = this.dataSource.data.map((value: Element) => {
      if (value.duiNit === row_obj.duiNit) {
        value.nombre = row_obj.nombre;
        value.apellido = row_obj.apellido;
        value.correo = row_obj.correo;
        value.estadoSolicitud = row_obj.estadoSolicitud;
      }
      return value;
    });
  }

  deleteRowData(row_obj: Element): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: Element) => {
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
  templateUrl: 'basic-table-dialog-content.html',
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
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Element
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
