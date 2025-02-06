import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  get urlApi(): string {
    return environments.urlApi
  }

  get localStorageTiposSolicitudKey(): string {
    return environments.localStorageTiposSolicitudKey;
  }

  get localStorageSolicitanteKey(): string {
    return environments.localStorageSolicitanteKey;
  }

  get localStorageRepresentanteKey(): string {
    return environments.localStorageRepresentanteKey;
  }

  get localStorageTipoUsuarioKey(): string {
    return environments.localStorageTipoUsuarioKey;
  }

  get localStorageDocumentoSolicitante(): string {
    return environments.localStorageDocumentoSolicitante;
  }

  get localStorageDocumentoRepresentante(): string {
    return environments.localStorageDocumentoRepresentante;
  }

  get tiempoLocalStorage(): number {
    return environments.tiempoLocalStorage;
  }

  get urlLogin(): string {
    return environments.uriLogin;
  }

  get production(): boolean {
    return environments.production;
  }
};
