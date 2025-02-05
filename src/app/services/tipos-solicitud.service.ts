// tipos-solicitud.service.ts
import { inject, Injectable } from '@angular/core';
import { TipoSolicitud } from '../pages/authentication/boxed-register/models/tipo-solicitud.model';
import { LocalStorageService } from './local-storage.service';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class TiposSolicitudService {
  private tiposSolicitud: TipoSolicitud[] = [];
  private readonly localStorageSrv = inject(LocalStorageService);
  private readonly environment = inject(EnvironmentService);

  setData(tiposSolicitud: TipoSolicitud[]): void {
    this.tiposSolicitud = tiposSolicitud;
    this.localStorageSrv.setItem(
      this.environment.localStorageTiposSolicitudKey,
      tiposSolicitud,
      this.environment.tiempoLocalStorage
    );
  }

  getData(): TipoSolicitud[] {
    return this.localStorageSrv.getItem<TipoSolicitud[]>(
      this.environment.localStorageTiposSolicitudKey
    ) || this.tiposSolicitud;
  }
}