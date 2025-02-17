import {Component, EventEmitter, Output} from '@angular/core';
import {AprobacionesComponent} from "./aprobaciones/aprobaciones.component";
import {DetallesAprobacionesComponent} from "./detalles-aprobaciones/detalles-aprobaciones.component";

@Component({
  selector: 'app-base-aprobaciones',
  standalone: true,
  imports: [
    AprobacionesComponent,
    DetallesAprobacionesComponent
  ],
  templateUrl: './base-aprobaciones.component.html',
  styles: ``
})
export class BaseAprobacionesComponent {

  verDetalle = false;
  elementoSeleccionado: any;

  mostrarDetalles(elemento: any) {
    this.elementoSeleccionado = elemento;
    this.verDetalle = true;
  }

  cerrarDetalles() {
    this.verDetalle = false;
    this.elementoSeleccionado = null;
  }

}
