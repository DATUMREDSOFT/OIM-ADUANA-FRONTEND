// tipo-usuario.service.ts
import { inject, Injectable } from '@angular/core';
import { FormType } from '../enums/form-type.enum';
import { LocalStorageService } from './local-storage.service';
import { EnvironmentService } from './environment.service';
import { Roles } from '../enums/roles.enum';

@Injectable({
  providedIn: 'root'
})
export class TipoUsuarioService {
  private readonly localStorageSrv = inject(LocalStorageService);
  private readonly environment = inject(EnvironmentService);
  private tipoUsuario!: Roles;

  setTipoUsuario(tipo: FormType): void {
    this.tipoUsuario = this.mapFormTypeToRole(tipo);
    this.localStorageSrv.setItem(
      this.environment.localStorageTipoUsuarioKey,
      this.tipoUsuario,
      this.environment.tiempoLocalStorage
    );
  }

  private mapFormTypeToRole(tipo: FormType): Roles {
    const mapping: Record<FormType, Roles> = {
      [FormType.PersonalNoAFPA]: Roles.NOAFPA,
      [FormType.AgenteAFPA]: Roles.AFPA,
      [FormType.Interno]: Roles.INTERNO,
      [FormType.SolicitudNoAFPA]: Roles.NOAFPA, // Default fallbacks
      [FormType.Aplicante]: Roles.NOAFPA,
      [FormType.Elaborador]: Roles.INTERNO
    };
    return mapping[tipo] || Roles.NOAFPA;
  }

  getTipoUsuario(): Roles {
    const stored = this.localStorageSrv.getItem<{ value: Roles }>(this.environment.localStorageTipoUsuarioKey);
    return stored?.value || this.tipoUsuario;
  }
}