import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QueryParamService {
  private readonly route = inject(ActivatedRoute);
  public userlogin!: string;
  public requester!: string;
  public role!: string;
  public key!: string;
  public roles!: string[];

  constructor() {
    this.inicializarQueryParams();
  }

  private inicializarQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['userlogin'] && params['requester'] && params['role'] && params['key']) {
        this.userlogin = params['userlogin'];
        this.requester = params['requester'];
        this.role = params['role'];
        this.key = params['key'];
        this.roles = this.role.split(',').filter(r => r.trim() !== '');
        console.log('Captured Query Params:', { userlogin: this.userlogin, role: this.role });
      } else {
        console.warn('Missing query parameters:', params);
        this.userlogin = 'NA';
      }
    });
  }

  crearRoles(rol: string): string[] {
    return rol.split(',').filter(element => element.trim() !== '');
  }

  getIsHasExternalAccess(): boolean {
    if (this.role === null) return false;
    return this.role.includes("ELABORADOR_JURIDICO") || this.role.includes("SOLICITANTE_JURIDICO") || this.role.includes("SERVICIO_AL_CLIENTE");
  }

  getIsHasInternalAccess(): boolean {
    if (this.role === null) return false;
    return this.role.includes("ELABORADOR,") || this.role.includes("SOLICITANTE,") || this.role.includes("SERVICIO_AL_CLIENTE");
  }
}
