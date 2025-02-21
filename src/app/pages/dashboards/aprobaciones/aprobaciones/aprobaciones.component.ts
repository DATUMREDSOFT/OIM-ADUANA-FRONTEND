import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
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
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatPaginator} from "@angular/material/paginator";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MockAprobacionesService} from "../../../../services/mock-aprobaciones.service";
import {MatIconButton} from "@angular/material/button";
import {first} from "rxjs";


export interface ELEMENT_DATA {
  DGA: string;
  formType: string;
  applicant: string;
  creationDate: string;
  status: string;
  step: string;
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
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderRowDef,
    MatRowDef,
    MatFormField,
    MatInput,
    MatIcon,
    MatIconModule,
    MatIconButton,
  ],
  templateUrl: './aprobaciones.component.html',
  styles: ``
})
export class AprobacionesComponent implements OnInit {

  @Output() verDetalle = new EventEmitter<any>();
  elementoSeleccionado: any;  // Objeto para guardar la solicitud detallada

  displayedColumns: string[] = [
    'Número de solicitud',
    'Tipo de formulario',
    'Solicitante',
    'Fecha de inicio',
    'Estado',
    'Paso',
    'Acción'
  ];
  dataSource = new MatTableDataSource<ELEMENT_DATA>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private mockService: MockAprobacionesService) {
  }

  ngOnInit(): void {

    this.mockService.getAllRequests()
      .pipe(first())
      .subscribe((response) => {
      console.log('Solicitudes obtenidas:', response);
      this.dataSource.data = response.map(item => ({
        DGA: item.id,
        formType: item.formType || 'Sin tipo',
        applicant: item?.applicant?.name || 'Desconocido',
        creationDate: this.formatDate(item.createdOn),
        status: item.status || 'Desconocido',
        step: item.step || 'Sin paso'
      }));


    });

    // 1) Obtener la lista de solicitudes (resumida)
    // this.mockService.getSolicitudes().subscribe((response) => {
    //   this.dataSource.data = response.map(item => ({
    //     DGA: item.id,
    //     formType: item.formType || 'Sin tipo',
    //     applicant: item?.applicant?.name || 'Desconocido',
    //     creationDate: this.formatDate(item.createdOn),
    //     status: item.status || 'Desconocido',
    //     step: item.step || 'Sin paso'
    //   }));
    // });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  formatDate(epochString: string): string {
    const epoch = Number(epochString);
    if (isNaN(epoch)) return 'Fecha no válida';
    return new Date(epoch).toISOString().split('T')[0];
  }

  applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: ELEMENT_DATA, filter: string) => {
      return data.DGA.toLowerCase().includes(filter);
    };
  }


  verMas(element: ELEMENT_DATA) {

    this.mockService.getSolicitudDetalle(element.DGA).subscribe(detalle => {
      console.log('Detalle obtenido:', detalle);

      this.verDetalle.emit(detalle);
    });
  }

}
