import {Injectable} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {dataSource} from "../pages/dashboards/aprobaciones/data";
import {Observable} from "rxjs";


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

@Injectable({
  providedIn: 'root'
})
export class AprobacionesService {


  private dummyData = dataSource;


  getAprobaciones(): Observable<ELEMENT_DATA[]> {
    return new Observable<ELEMENT_DATA[]>(subscriber => {
      subscriber.next(this.dummyData);
      subscriber.complete();
    });
  }


}



















