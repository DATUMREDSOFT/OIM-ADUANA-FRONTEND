import {Component, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
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
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatPaginator} from "@angular/material/paginator";
import {NgForOf, NgIf} from "@angular/common";
import {TablerIconsModule} from "angular-tabler-icons";
import {ConfirmationDialogComponent} from "../../../../apps/UsersTable/confirmation/confirmation-dialog.component";
import {Employee, employees} from "../../usuraiosDummyData";

import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";

interface FilterValues {
  search: string;
  tipoCuenta: string;
  estadoCuenta: string;
}

interface FilterObject {
  name: keyof FilterValues;
  options: string[];
  defaultValue: string;
}

@Component({
  selector: 'app-solicitud-activar-usuario',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatInput,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSuffix,
    MatTable,
    NgIf,
    TablerIconsModule,
    MatHeaderCellDef,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './solicitud-activar-usuario.component.html',
})
export class SolicitudActivarUsuarioComponent implements OnInit {

  constructor(private dialog: MatDialog, private router: Router) {
  }


  @ViewChild(MatTable, {static: true}) table!: MatTable<any>;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  // Opciones de los filtros dropdown
  tipoCuenta: string[] = ['All', 'digitador', 'webservice'];
  estado: string[] = ['All', 'Activa', 'Inactiva'];

  // Objeto que contiene todos los filtros
  filterValues: FilterValues = {
    search: '',
    tipoCuenta: 'All',
    estadoCuenta: 'All'
  };

  displayedColumns: string[] = [
    'duiNit',
    'nombre',
    'apellido',
    'correo',
    'tipoCuenta',
    'estadoCuenta',
    'action',
  ];


  dataSourceFilters = new MatTableDataSource(employees);

  userFilters: FilterObject[] = [
    {name: 'tipoCuenta', options: this.tipoCuenta, defaultValue: 'All'},
    {name: 'estadoCuenta', options: this.estado, defaultValue: 'All'}
  ];


  ngOnInit(): void {

    this.dataSourceFilters.filterPredicate = (record: Employee, filter: string) => {
      const filters = JSON.parse(filter);
      const searchText = filters.search.toLowerCase();

      // Verificar que el registro coincida con el texto de búsqueda en campos relevantes
      const matchesSearch = !searchText || (record.duiNit?.toString().toLowerCase().includes(searchText) ||
        record.nombre?.toLowerCase().includes(searchText));

      // Verificar que los dropdowns cumplan con el filtro seleccionado
      const matchesTipoCuenta = filters.tipoCuenta === 'All' || record.tipoCuenta === filters.tipoCuenta;
      const matchesEstadoCuenta = filters.estadoCuenta === 'All' || record.estadoCuenta === filters.estadoCuenta;

      return matchesSearch && matchesTipoCuenta && matchesEstadoCuenta;
    };
  }

  ngAfterViewInit(): void {
    this.dataSourceFilters.paginator = this.paginator;
  }


  applySearchFilter(filterValue: string): void {
    this.filterValues.search = filterValue.trim();
    this.dataSourceFilters.filter = JSON.stringify(this.filterValues);
  }

  // Actualiza el filtro correspondiente al dropdown modificado
  applyUserFilters(ob: MatSelectChange, empfilter: FilterObject): void {
    this.filterValues[empfilter.name] = ob.value;
    this.dataSourceFilters.filter = JSON.stringify(this.filterValues);
  }

  openConfirmationDialog(action: string, obj: Employee): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {action, obj},
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'confirm') {
        if (action === 'Solicitud desactivacion de usuario') {
          this.updateRowData({...obj, estadoCuenta: 'Inactiva'});
        } else if (action === 'Solicitud activacion de usuario') {
          this.updateRowData({...obj, estadoCuenta: 'Activa'});
        }
      }
    });
  }

  updateRowData(row_obj: Employee): void {
    this.dataSourceFilters.data = this.dataSourceFilters.data.map((value: Employee) => {
      if (value.duiNit === row_obj.duiNit) {
        return {...value, ...row_obj};
      }
      return value;
    });
  }

}



