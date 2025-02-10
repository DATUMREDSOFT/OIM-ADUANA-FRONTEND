import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FormularioExterno } from '../pages/dashboards/solicitud-externo/models/formulario-externo.model';
import { Request as Req } from '../enums/request.enum';
import { Request } from '../pages/dashboards/solicitud-externo/models/request.model';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Profile } from '../pages/dashboards/solicitud-externo/models/profile.model';
import { System } from '../pages/dashboards/solicitud-externo/models/system.model';
import { Other } from '../pages/dashboards/solicitud-externo/models/other.model';
import { Flow } from '../pages/dashboards/solicitud-externo/models/flow.model';
import { lastValueFrom } from 'rxjs';
import { TipoUsuarioService } from './tipo-usuario.service';
import { Roles } from '../enums/roles.enum';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProcesoFormularioService {
  private readonly apiService = inject(ApiService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly tipoUsuario = inject(TipoUsuarioService);
  private readonly cookieService = inject(CookieService);

  private getUserLogin(): string | null {
    const token = this.cookieService.get('authToken');
    if (!token) return null;
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken?.sub || null;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  async iniciarProceso(form: Partial<FormularioExterno>): Promise<string | boolean> {
    try {
      let formType = this.tipoUsuario.getTipoUsuario() === Roles.INTERNO ? 'Interno' : 'Externo';
      form.formType = formType;
      form.createdBy = this.getUserLogin() ?? undefined;

      const res = await lastValueFrom(this.apiService.request<FormularioExterno>('POST', 'dga/form', { body: form }));
      if (!res.id) return false;

      form.id = res.id;
      await this.enviarSolicitudes(form.id);
      return res.id;
    } catch (error) {
      this.spinner.hide();
      const err = error as any;
      Swal.fire('Error', 'Error al procesar la solicitud: ' + err.message, 'error');
      return false;
    }
  }

  async enviarSolicitudes(formId: string): Promise<void> {
    try {
      const res = await lastValueFrom(this.apiService.request<Request>('POST', `dga/form/request/${formId}`));
      console.log('Solicitud enviada con éxito:', res);
    } catch (error) {
      this.spinner.hide();
      const err = error as any;
      Swal.fire('Error', 'Error al enviar la solicitud: ' + err.message, 'error');
    }
  }

  async enviarPerfiles(req: Request): Promise<void> {
    for (const profile of req.profiles) {
      try {
        await lastValueFrom(this.apiService.request<Profile>(Req.POST, `dga/form/request/profile/${req.id}`, { body: profile }));
      } catch (err: any) {
        Swal.fire('Error', 'Error al enviar perfil: ' + err.message, 'error');
      }
    }
  }

  async enviarSistemas(req: Request): Promise<void> {
    for (const system of req.systems) {
      try {
        await lastValueFrom(this.apiService.request<System>(Req.POST, `dga/form/request/system/${req.id}`, { body: system }));
      } catch (err: any) {
        Swal.fire('Error', 'Error al enviar sistema: ' + err.message, 'error');
      }
    }
  }

  async enviarOtros(req: Request): Promise<void> {
    for (const other of req.others) {
      try {
        await lastValueFrom(this.apiService.request<Other>(Req.POST, `dga/form/request/other/${req.id}`, { body: other }));
      } catch (err: any) {
        this.spinner.hide();
        Swal.fire('Error', 'Error al enviar otro: ' + err.message, 'error');
      }
    }
  }

  async enviarFlow(req: Request): Promise<void> {
    try {
      await lastValueFrom(this.apiService.request<Flow>(Req.POST, `dga/flow?requestId=${req.id}&processId=NA`));
    } catch (err: any) {
      this.spinner.hide();
      Swal.fire('Error', 'Error al enviar flujo: ' + err.message, 'error');
    }
  }

  async enviarEmail(req: Request): Promise<void> {
    try {
      await lastValueFrom(this.apiService.request<Flow>(Req.GET, `dga/flow/email?requestId=${req.id}`));
      this.spinner.hide();
    } catch (err: any) {
      this.spinner.hide();
      Swal.fire('Error', 'Error al enviar email: ' + err.message, 'error');
    }
  }
}
