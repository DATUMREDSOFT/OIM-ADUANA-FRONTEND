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


enum Priority {
  pending = 'Pendiente',
  approved = 'Aprobado',
  rejected = 'Rechazado'
}

interface ELEMENT_DATA {
  uname: string;
  position: string;
  productName: string;
  priority: Priority;
  budget: number;
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


  displayedColumns: string[] = ['DGA', 'name', 'priority', 'budget'];
  dataSource = new MatTableDataSource<ELEMENT_DATA>([
    {

      uname: 'John Doe',
      position: 'Project Manager',
      productName: 'CRM System',
      priority: Priority.pending,
      budget: 15
    },
    {

      uname: 'Jane Smith',
      position: 'UI/UX Designer',
      productName: 'Website Redesign',
      priority: Priority.approved,
      budget: 8
    },
    {

      uname: 'David Johnson',
      position: 'Software Engineer',
      productName: 'Mobile App',
      priority: Priority.rejected,
      budget: 25
    },

  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


}
