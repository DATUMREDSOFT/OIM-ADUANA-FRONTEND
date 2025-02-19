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
      [FormType.SolicitudNoAFPA]: Roles.NOAFPA,
      [FormType.Aplicante]: Roles.NOAFPA,
      [FormType.Elaborador]: Roles.INTERNO
    };
    return mapping[tipo] || Roles.NOAFPA;
  }

  /**
   * ✅ Get user role, but return "Externo" for NOAFPA users
   */
  getTipoUsuario(): Roles {
    const rawStoredData = localStorage.getItem(this.environment.localStorageTipoUsuarioKey);
    console.log("🔍 Raw Local Storage Value:", rawStoredData); // Check raw storage data
  
    const stored = this.localStorageSrv.getItem<{ value?: Roles }>(this.environment.localStorageTipoUsuarioKey);
    console.log("🔍 Parsed Local Storage Data:", stored); // Check parsed version
  
    if (!stored || !stored.value) {
      console.warn("⚠️ No valid role found in Local Storage! Using fallback.");
      return this.tipoUsuario || Roles.NOAFPA;
    }
  
    console.log("✅ Retrieved User Role from Local Storage:", stored.value);
    return stored.value;
  }
   

}