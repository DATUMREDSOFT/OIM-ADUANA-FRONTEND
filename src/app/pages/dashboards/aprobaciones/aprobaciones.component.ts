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

export interface Perfiles {
  nombre: string;
  apellido: string;
  cargo: string;
  fechaCreacion: string;
  fechaEliminacion: string;
}

export interface ELEMENT_DATA {

  DGA: string;
  description: string;
  date: string;
  state: State;
  perfiles: Perfiles[];
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
      state: State.pending,
      perfiles: [
        {
          nombre: 'Juan',
          apellido: 'Pérez',
          cargo: 'Analista',
          fechaCreacion: '2023-01-10',
          fechaEliminacion: '2023-02-15'
        },
        {
          nombre: 'Ana',
          apellido: 'Gómez',
          cargo: 'Gerente',
          fechaCreacion: '2023-02-15',
          fechaEliminacion: '2023-03-20'
        },
      ]
    },
    {
      DGA: 'DGA-002',
      description: 'Actualización de Permisos',
      date: '2024-02-05',
      state: State.approved,
      perfiles: [
        {
          nombre: 'Carlos',
          apellido: 'Ramírez',
          cargo: 'Supervisor',
          fechaCreacion: '2023-03-10',
          fechaEliminacion: '2023-04-12'
        },
        {
          nombre: 'Laura',
          apellido: 'Fernández',
          cargo: 'Coordinadora',
          fechaCreacion: '2023-04-15',
          fechaEliminacion: '2023-05-18'
        },
      ]
    },
    {
      DGA: 'DGA-003',
      description: 'Eliminación de Usuario',
      date: '2024-02-10',
      state: State.rejected,
      perfiles: [
        {
          nombre: 'Miguel',
          apellido: 'Torres',
          cargo: 'Administrador',
          fechaCreacion: '2023-05-01',
          fechaEliminacion: '2023-06-10'
        }
      ]
    },
    {
      DGA: 'DGA-004',
      description: 'Cambio de Rol',
      date: '2024-02-15',
      state: State.pending,
      perfiles: [
        {
          nombre: 'Andrea',
          apellido: 'López',
          cargo: 'Analista Senior',
          fechaCreacion: '2023-07-05',
          fechaEliminacion: '2023-08-12'
        },
        {
          nombre: 'Pedro',
          apellido: 'Sánchez',
          cargo: 'Gerente',
          fechaCreacion: '2023-08-15',
          fechaEliminacion: '2023-09-20'
        },
      ]
    },
    {
      DGA: 'DGA-005',
      description: 'Creación de Grupo',
      date: '2024-02-20',
      state: State.approved,
      perfiles: [
        {
          nombre: 'Sofía',
          apellido: 'Martínez',
          cargo: 'Especialista',
          fechaCreacion: '2023-10-10',
          fechaEliminacion: '2023-11-15'
        }
      ]
    },
    {
      DGA: 'DGA-006',
      description: 'Actualización de Datos',
      date: '2024-02-25',
      state: State.pending,
      perfiles: [
        {
          nombre: 'Luis',
          apellido: 'García',
          cargo: 'Técnico',
          fechaCreacion: '2023-12-01',
          fechaEliminacion: '2024-01-10'
        }
      ]
    },
    {
      DGA: 'DGA-007',
      description: 'Solicitud de Acceso',
      date: '2024-02-28',
      state: State.rejected,
      perfiles: [
        {
          nombre: 'Camila',
          apellido: 'Ortega',
          cargo: 'Asesora',
          fechaCreacion: '2024-01-15',
          fechaEliminacion: '2024-02-20'
        }
      ]
    },
    {
      DGA: 'DGA-008',
      description: 'Eliminación de Permisos',
      date: '2024-03-01',
      state: State.pending,
      perfiles: [
        {
          nombre: 'Diego',
          apellido: 'Morales',
          cargo: 'Director',
          fechaCreacion: '2024-02-05',
          fechaEliminacion: '2024-03-10'
        },
        {
          nombre: 'María',
          apellido: 'Herrera',
          cargo: 'Coordinadora',
          fechaCreacion: '2024-02-15',
          fechaEliminacion: '2024-03-20'
        },
      ]
    },
    {
      DGA: 'DGA-009',
      description: 'Modificación de Grupo',
      date: '2024-03-05',
      state: State.approved,
      perfiles: [
        {
          nombre: 'Fernando',
          apellido: 'Ruiz',
          cargo: 'Líder de Proyecto',
          fechaCreacion: '2024-03-01',
          fechaEliminacion: '2024-04-05'
        }
      ]
    },
    {
      DGA: 'DGA-010',
      description: 'Creación de Nuevo Proyecto',
      date: '2024-03-10',
      state: State.pending,
      perfiles: [
        {
          nombre: 'Valentina',
          apellido: 'Castro',
          cargo: 'Gestora',
          fechaCreacion: '2024-03-15',
          fechaEliminacion: '2024-04-20'
        }
      ]
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

  elementoSeleccionado: any;

  verMas(element: any) {
    this.mostrarDetalles = true;
    this.elementoSeleccionado = element;
  }

  cerrarDetalles() {
    this.mostrarDetalles = false;

    this.elementoSeleccionado = null;

    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage(); // Regresa a la primera página
      }
    });
  }

}
