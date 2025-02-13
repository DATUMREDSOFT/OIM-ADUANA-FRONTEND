import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
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


export interface Aprobacion {
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
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
    MatPaginator
  ],
  templateUrl: './detalles-aprobaciones.component.html',
})
export class DetallesAprobacionesComponent {

  @Output() cerrar = new EventEmitter<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['nombre', 'apellido', 'correo', 'cargo'];
  dataSource = new MatTableDataSource<Aprobacion>([
    { nombre: 'Juan', apellido: 'Pérez', correo: 'juan@example.com', cargo: 'Gerente' },
    { nombre: 'Ana', apellido: 'Gómez', correo: 'ana@example.com', cargo: 'Analista' },
    { nombre: 'Carlos', apellido: 'Ruiz', correo: 'carlos@example.com', cargo: 'Supervisor' },
    { nombre: 'Marta', apellido: 'López', correo: 'marta@example.com', cargo: 'Directora' }
  ]);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cerrarDetalles() {
    this.cerrar.emit();
  }

  applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

}


