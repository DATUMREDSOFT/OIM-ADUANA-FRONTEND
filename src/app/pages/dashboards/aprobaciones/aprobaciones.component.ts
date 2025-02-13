import {Component, ViewChild} from '@angular/core';
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
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatPaginator} from "@angular/material/paginator";
import {NgIf, NgStyle, TitleCasePipe} from "@angular/common";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {Router} from "@angular/router";
import {DetallesAprobacionesComponent} from "./detalles-aprobaciones/detalles-aprobaciones.component";


export enum State {
  pending = 'Pendiente',
  approved = 'Aprobado',
  rejected = 'Rechazado'
}

export enum Header {
  DGA = 'DGA',
  Description = 'Descripción',
  Date = 'Fecha de Creación',
  State = 'Estado',
  Action = 'Resumen'
}


export interface ELEMENT_DATA {

  DGA: string;
  description: string;
  date: string;
  state: State;
}


@Component({
  selector: 'app-aprobaciones',
  standalone: true,
  imports: [
    MatTable,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatPaginator,
    MatRow,
    TitleCasePipe,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderRowDef,
    MatRowDef,
    MatFormField,
    MatInput,
    MatIcon,
    MatIconButton,
    MatLabel,
    MatSuffix,
    NgStyle,
    MatIconModule,
    DetallesAprobacionesComponent,
    NgIf
  ],
  templateUrl: './aprobaciones.component.html',
  styles: ``
})
export class AprobacionesComponent {



  displayedColumns: string[] = [Header.DGA, Header.Description, Header.Date, Header.State, Header.Action];


  dataSource = new MatTableDataSource<ELEMENT_DATA>([
    {
      DGA: 'DGA-001',
      description: 'Nuevo Usuario',
      date: '2024-02-01',
      state: State.pending
    },
    {
      DGA: 'DGA-002',
      description: 'Nuevo Usuario',
      date: '2024-02-02',
      state: State.approved
    },
    {
      DGA: 'DGA-003',
      description: 'Nuevo Usuario',
      date: '2024-02-03',
      state: State.rejected
    },
    {
      DGA: 'DGA-004',
      description: 'Nuevo Usuario',
      date: '2024-02-04',
      state: State.pending
    },
    {
      DGA: 'DGA-005',
      description: 'Nuevo Usuario',
      date: '2024-02-05',
      state: State.approved
    },
    {
      DGA: 'DGA-006',
      description: 'Nuevo Usuario',
      date: '2024-02-06',
      state: State.rejected
    },
    {
      DGA: 'DGA-007',
      description: 'Nuevo Usuario',
      date: '2024-02-07',
      state: State.pending
    },
    {
      DGA: 'DGA-008',
      description: 'Nuevo Usuario',
      date: '2024-02-08',
      state: State.approved
    },
    {
      DGA: 'DGA-009',
      description: 'Nuevo Usuario',
      date: '2024-02-09',
      state: State.rejected
    },
    {
      DGA: 'DGA-010',
      description: 'Nuevo Usuario',
      date: '2024-02-10',
      state: State.pending
    },
    {
      DGA: 'DGA-010',
      description: 'Nuevo Usuario',
      date: '2024-02-10',
      state: State.pending
    },
    {
      DGA: 'DGA-010',
      description: 'Nuevo Usuario',
      date: '2024-02-10',
      state: State.pending
    }
  ]);


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  applyFilter(event: Event) {


    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();

    // Configurar un predicado de filtro personalizado para filtrar solo por la columna "DGA"
    this.dataSource.filterPredicate = (data: ELEMENT_DATA, filter: string) => {
      return data.DGA.toLowerCase().includes(filter); // Comparar solo la columna DGA
    };
  }


  protected readonly Header = Header;
  protected readonly State = State;


  mostrarDetalles = false;

  verMas(element: any) {
    this.mostrarDetalles = true;
  }

  cerrarDetalles() {
    this.mostrarDetalles = false;

    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage(); // Regresa a la primera página
      }
    });
  }

}
