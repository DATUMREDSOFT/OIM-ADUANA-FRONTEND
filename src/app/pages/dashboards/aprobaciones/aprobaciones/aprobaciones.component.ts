import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
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
import {DetallesAprobacionesComponent} from "../detalles-aprobaciones/detalles-aprobaciones.component";


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
  email: string;
  phoneNumber: string;
  organizationCode: string;
  estado: string;

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
    MatIconModule,
    NgIf
  ],
  templateUrl: './aprobaciones.component.html',

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
          fechaEliminacion: '2023-02-15',
          email: 'juan.perez@example.com',
          phoneNumber: '2345678901',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Ana',
          apellido: 'Gómez',
          cargo: 'Gerente',
          fechaCreacion: '2023-02-15',
          fechaEliminacion: '2023-03-20',
          email: 'ana.gomez@example.com',
          phoneNumber: '2345678902',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        }
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
          fechaEliminacion: '2023-04-12',
          email: 'carlos.ramirez@example.com',
          phoneNumber: '2345678903',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Laura',
          apellido: 'Fernández',
          cargo: 'Coordinadora',
          fechaCreacion: '2023-04-15',
          fechaEliminacion: '2023-05-18',
          email: 'laura.fernandez@example.com',
          phoneNumber: '2345678904',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        }
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
          fechaEliminacion: '2023-06-10',
          email: 'miguel.torres@example.com',
          phoneNumber: '2345678905',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
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
          fechaEliminacion: '2023-08-12',
          email: 'andrea.lopez@example.com',
          phoneNumber: '2345678906',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Pedro',
          apellido: 'Sánchez',
          cargo: 'Gerente',
          fechaCreacion: '2023-08-15',
          fechaEliminacion: '2023-09-20',
          email: 'pedro.sanchez@example.com',
          phoneNumber: '2345678907',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Andrea',
          apellido: 'López',
          cargo: 'Analista Senior',
          fechaCreacion: '2023-07-05',
          fechaEliminacion: '2023-08-12',
          email: 'andrea.lopez@example.com',
          phoneNumber: '2345678906',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Pedro',
          apellido: 'Sánchez',
          cargo: 'Gerente',
          fechaCreacion: '2023-08-15',
          fechaEliminacion: '2023-09-20',
          email: 'pedro.sanchez@example.com',
          phoneNumber: '2345678907',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Andrea',
          apellido: 'López',
          cargo: 'Analista Senior',
          fechaCreacion: '2023-07-05',
          fechaEliminacion: '2023-08-12',
          email: 'andrea.lopez@example.com',
          phoneNumber: '2345678906',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Pedro',
          apellido: 'Sánchez',
          cargo: 'Gerente',
          fechaCreacion: '2023-08-15',
          fechaEliminacion: '2023-09-20',
          email: 'pedro.sanchez@example.com',
          phoneNumber: '2345678907',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },

        {
          nombre: 'Andrea',
          apellido: 'López',
          cargo: 'Analista Senior',
          fechaCreacion: '2023-07-05',
          fechaEliminacion: '2023-08-12',
          email: 'andrea.lopez@example.com',
          phoneNumber: '2345678906',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Pedro',
          apellido: 'Sánchez',
          cargo: 'Gerente',
          fechaCreacion: '2023-08-15',
          fechaEliminacion: '2023-09-20',
          email: 'pedro.sanchez@example.com',
          phoneNumber: '2345678907',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Andrea',
          apellido: 'López',
          cargo: 'Analista Senior',
          fechaCreacion: '2023-07-05',
          fechaEliminacion: '2023-08-12',
          email: 'andrea.lopez@example.com',
          phoneNumber: '2345678906',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Pedro',
          apellido: 'Sánchez',
          cargo: 'Gerente',
          fechaCreacion: '2023-08-15',
          fechaEliminacion: '2023-09-20',
          email: 'pedro.sanchez@example.com',
          phoneNumber: '2345678907',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Andrea',
          apellido: 'López',
          cargo: 'Analista Senior',
          fechaCreacion: '2023-07-05',
          fechaEliminacion: '2023-08-12',
          email: 'andrea.lopez@example.com',
          phoneNumber: '2345678906',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Pedro',
          apellido: 'Sánchez',
          cargo: 'Gerente',
          fechaCreacion: '2023-08-15',
          fechaEliminacion: '2023-09-20',
          email: 'pedro.sanchez@example.com',
          phoneNumber: '2345678907',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Andrea',
          apellido: 'López',
          cargo: 'Analista Senior',
          fechaCreacion: '2023-07-05',
          fechaEliminacion: '2023-08-12',
          email: 'andrea.lopez@example.com',
          phoneNumber: '2345678906',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'Pedro',
          apellido: 'Sánchez',
          cargo: 'Gerente',
          fechaCreacion: '2023-08-15',
          fechaEliminacion: '2023-09-20',
          email: 'pedro.sanchez@example.com',
          phoneNumber: '2345678907',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        }
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
          fechaEliminacion: '2023-11-15',
          email: 'sofia.martinez@example.com',
          phoneNumber: '2345678908',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
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
          fechaEliminacion: '2024-01-10',
          email: 'luis.garcia@example.com',
          phoneNumber: '2345678909',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
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
          fechaEliminacion: '2024-02-20',
          email: 'camila.ortega@example.com',
          phoneNumber: '2345678910',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
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
          fechaEliminacion: '2024-03-10',
          email: 'diego.morales@example.com',
          phoneNumber: '2345678911',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        },
        {
          nombre: 'María',
          apellido: 'Herrera',
          cargo: 'Coordinadora',
          fechaCreacion: '2024-02-15',
          fechaEliminacion: '2024-03-20',
          email: 'maria.herrera@example.com',
          phoneNumber: '2345678912',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
        }
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
          fechaEliminacion: '2024-04-05',
          email: 'fernando.ruiz@example.com',
          phoneNumber: '2345678913',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
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
          fechaEliminacion: '2024-04-20',
          email: 'valentina.castro@example.com',
          phoneNumber: '2345678914',
          organizationCode: 'DGA Externo',
          estado: 'pendiente'
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


    this.dataSource.filterPredicate = (data: ELEMENT_DATA, filter: string) => {
      return data.DGA.toLowerCase().includes(filter); // Comparar solo la columna DGA
    };
  }


  protected readonly Header = Header;
  protected readonly State = State;


  @Output() verDetalle = new EventEmitter<any>();

  elementoSeleccionado: any;

  verMas(element: any) {
    this.verDetalle.emit(element);
  }


}