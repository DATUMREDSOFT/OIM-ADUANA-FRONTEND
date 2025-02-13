import {Component, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatPaginator} from "@angular/material/paginator";
import {TitleCasePipe} from "@angular/common";


enum State {
  pending = 'Pendiente',
  approved = 'Aprobado',
  rejected = 'Rechazado'
}

enum Header {
  DGA = 'DGA',
  Description = 'Descripción',
  Date = 'Fecha de Creación',
  State = 'Estado'
}


interface ELEMENT_DATA {

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
    MatRowDef
  ],
  templateUrl: './aprobaciones.component.html',
  styles: ``
})
export class AprobacionesComponent {


  displayedColumns: string[] = [Header.DGA, Header.Description, Header.Date, Header.State];


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


  protected readonly State = State;
  protected readonly Header = Header;
  protected readonly MatHeaderRow = MatHeaderRow;
}
