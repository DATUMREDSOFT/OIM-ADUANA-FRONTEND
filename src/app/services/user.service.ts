import {inject, Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {Roles} from "../enums/roles.enum";
import {LocalStorageService} from "./local-storage.service";
import {FormType} from "../enums/form-type.enum";
import {environments} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly localStorageSrv = inject(LocalStorageService);
  private tipoUsuario!: Roles;

  setTipoUsuario(tipo: FormType): void {
    this.tipoUsuario = tipo === FormType.PersonalNoAFPA ? Roles.NOAFPA : tipo === FormType.AgenteAFPA ? Roles.AFPA : Roles.INTERNO;
    this.localStorageSrv.setItem(environments.localStorageTipoUsuarioKey, this.tipoUsuario, environments.tiempoLocalStorage);
  }

  getTipoUsuario(): Roles {
    return this.tipoUsuario ?? this.localStorageSrv.getItem(environments.localStorageTipoUsuarioKey) ?? undefined;
  }
}
