import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatFormField} from "@angular/material/form-field";
import {NgApexchartsModule} from "ng-apexcharts";
import {TablerIconsModule} from "angular-tabler-icons";
import {MatInput} from "@angular/material/input";
import {MatPaginator} from "@angular/material/paginator";
import Swal from "sweetalert2";
import {MatCheckbox} from "@angular/material/checkbox";
import {SelectionModel} from "@angular/cdk/collections";
import {UpperCasePipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {MatBadge} from "@angular/material/badge";


export interface Aprobacion {
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
  estado: string;
}

@Component({
  selector: 'app-detalles-aprobaciones',
  standalone: true,
  imports: [
    MatButton,
    MatCardContent,
    MatHeaderRow,
    MatColumnDef,

    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatRowDef,
    MatHeaderRowDef,
    MatRow,
    MatCard,
    MatFormField,
    NgApexchartsModule,
    TablerIconsModule,
    MatInput,
    MatPaginator,
    MatCheckbox,
    UpperCasePipe,
    MatIconModule,
    MatDivider,
    MatBadge
  ],
  templateUrl: './detalles-aprobaciones.component.html',
})
export class DetallesAprobacionesComponent {


  @Output() cerrar = new EventEmitter<void>();
  @Input() elemento: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<Aprobacion>();
  selection = new SelectionModel<Aprobacion>(true, []);
  displayedColumnsPerfiles: string[] = ['select', 'nombre', 'apellido', 'cargo', 'fecha de creacion', 'fecha de eliminacion'];

  ngOnInit() {
    if (this.elemento?.perfiles) {
      this.dataSource.data = this.elemento.perfiles;
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: Aprobacion): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  cerrarDetalles() {
    this.cerrar.emit();
  }

  approveRequest(elemento: any) {
    const elementosAprobar = this.selection.selected.length > 0 ?
      this.selection.selected : [elemento];

    // Mostrar elementos seleccionados para aprobar
    console.log('Elementos seleccionados para aprobar:', elementosAprobar);
    console.log('Cantidad de elementos a aprobar:', elementosAprobar.length);

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción aprobará la(s) solicitud(es) seleccionada(s).',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        elementosAprobar.forEach(elem => {
          elem.state = 'approved';
          // Log detallado de cada elemento aprobado
          console.log('Elemento aprobado:', {
            nombre: elem.nombre,
            apellido: elem.apellido,
            cargo: elem.cargo,
            estado: elem.estado
          });
        });
        Swal.fire('Aprobado', 'Las solicitudes han sido aprobadas', 'success');
      }
    });
  }

  rejectRequest(elemento: any) {

    const elementosRechazar = this.selection.selected.length > 0 ?
      this.selection.selected : [elemento];

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción rechazará la(s) solicitud(es) seleccionada(s).',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        elementosRechazar.forEach((elem: { estado: string; }) => {
          elem.estado = 'rejected';
          console.log('Request Rejected:', elem);
        });
        Swal.fire('Rechazado', 'Las solicitudes han sido rechazadas', 'error');
      }
    });
  }

}


