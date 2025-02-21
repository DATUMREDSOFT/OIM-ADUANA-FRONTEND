import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
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
import {NgApexchartsModule} from "ng-apexcharts";
import {TablerIconsModule} from "angular-tabler-icons";
import {MatPaginator} from "@angular/material/paginator";
import Swal from "sweetalert2";
import {MatCheckbox} from "@angular/material/checkbox";
import {SelectionModel} from "@angular/cdk/collections";

import {MatIconModule} from "@angular/material/icon";

import {ReactiveFormsModule} from "@angular/forms";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatBadge} from "@angular/material/badge";
import {MatDivider} from "@angular/material/divider";
import {MockAprobacionesService} from "../../../../services/mock-aprobaciones.service";


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
    NgApexchartsModule,
    TablerIconsModule,
    MatCheckbox,
    MatIconModule,
    ReactiveFormsModule,
    MatCardContent,
    MatButton,
    MatBadge,
    MatDivider,
    MatCard,
  ],
  templateUrl: './detalles-aprobaciones.component.html',
})
export class DetallesAprobacionesComponent {


  @Output() cerrarDetalle = new EventEmitter<void>();
  @Input() elemento: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private mockAprobacionesService: MockAprobacionesService) {
  }

  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);

  displayedColumnsPerfiles: string[] = [
    'select',
    'ID',
    'Fecha de solicitud',
    'Usuario',
    'Estado',
    'Resumen'
  ];


  ngOnInit() {

    this.mockAprobacionesService.getSolicitudDetalle(this.elemento.id).subscribe((data) => {
      this.dataSource.data = data.requests;
    });

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
    this.cerrarDetalle.emit();
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
        });
        Swal.fire('Rechazado', 'Las solicitudes han sido rechazadas', 'error');
      }
    });
  }

}


