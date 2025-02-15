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

  getUserLogin(): string | null {
    const token = this.cookieService.get('authToken');
    if (!token) return 'NA';
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken?.sub || 'NA';
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return 'NA';
    }
  }

  async iniciarProceso(form: Partial<FormularioExterno>): Promise<string | boolean> {
    try {
        let formType = this.tipoUsuario.getTipoUsuario() === Roles.INTERNO ? 'Interno' : 'Externo';

        // ✅ Fix Applicant Data Structure
        const applicant = {
            document: form.applicant?.document || "NA",
            position: {
                id: form.applicant?.position?.id || "NA",
                status: form.applicant?.position?.status || "ENABLED",
                value: form.applicant?.position?.value || "N/A"
            },
            attribute: {
                id: form.applicant?.attribute?.id || "NA",
                status: form.applicant?.attribute?.status || "ENABLED",
                value: form.applicant?.attribute?.value || "N/A"
            },
            externalType: {
                id: form.applicant?.externalType?.id || "PERSONAL",
                status: form.applicant?.externalType?.status || "ENABLED",
                value: form.applicant?.externalType?.value || "Persona Natural"
            },
            name: form.applicant?.name || "Unknown",
            externalName: form.applicant?.externalName || "Unknown",
            mail: form.applicant?.mail || "unknown@example.com",
            externalRepLegal: form.applicant?.externalRepLegal || "Unknown",
            externalCodeDeclarant: form.applicant?.externalCodeDeclarant || "Unknown",
            id: form.applicant?.id || "NA"
        };

        // ✅ Fix Requests Data
        const requests = form.requests?.map(req => ({
          id: req.id || "Pendiente de guardar",
          typeRequest: {
              id: req.typeRequest?.id || "TYREQ-1",
              value: req.typeRequest?.value || "Nuevo Usuario",
              status: req.typeRequest?.status || undefined
          },
          state: "PENDIENTE DE ASIGNAR",
          createBy: form.createdBy || "NA",
          createOn: Date.now().toString(),
          approveDate: "", // ✅ Added missing field
          profiles: req.profiles?.length ? req.profiles : [], // ✅ Ensure correct format
          resources: req.resources?.length ? req.resources : [], // ✅ Ensure correct format
          systems: req.systems?.map(sys => ({
              id: sys.id || "CATSYS-12",
              status: sys.status || "PENDIENTE DE ASIGNAR",
              type: "Externo",
              startDate: sys.startDate || Date.now().toString(),
              endDate: sys.endDate || Date.now().toString(),
              group: {
                  id: sys.group?.id || "CATGRP-78",
                  status: sys.group?.status || "ENABLED",
                  value: sys.group?.value || "PAGOES",
                  system: null
              },
              custom: { id: 'NA', value: 'N/A' }
          })) || [],
          others: req.others?.length ? req.others : [],
          flow: req.flow?.length ? req.flow : [],
          person: {
              document: req.person?.document || "NA",
              surName: req.person?.surName || "",
              lastName: req.person?.lastName || "",
              uid: req.person?.uid || "",
              mail: req.person?.mail || "unknown@example.com",
              phoneNumber: req.person?.phoneNumber || "",
              mobile: req.person?.mobile || "",
              fullName: req.person?.fullName || "null ",
              organizationCode: "DGA Externo",
              position: req.person?.position || { id: 'NA', value: 'N/A', status: 'ENABLED' },
              levelOne: req.person?.levelOne || { id: 'NA', value: 'N/A', status: 'ENABLED' },
              levelTwo: req.person?.levelTwo || { id: 'NA', value: 'N/A', status: 'ENABLED' },
              levelThree: req.person?.levelThree || { id: 'NA', value: 'N/A', status: 'ENABLED' },
              levelFour: req.person?.levelFour || { id: 'NA', value: 'N/A', status: 'ENABLED' },
              startDate: req.person?.startDate || Date.now().toString(),
              endDate: req.person?.endDate || '',
              attribute: req.person?.attribute || { id: 'NA', value: 'N/A', status: 'ENABLED' },
              typeAFPA: req.person?.typeAFPA || { id: 'NA', value: 'N/A', status: 'ENABLED' },
              isAFPA: req.person?.isAFPA || false,
              resolution: req.person?.resolution || '',
              codeDeclarant: req.person?.codeDeclarant || '',
              id: req.person?.id || 'PER-8832',
              approveAFPA: req.person?.approveAFPA || '',
              alternativeMail: req.person?.alternativeMail || '',
              state: req.person?.state || 'ACTIVE',
              userType: 'Externo'
          }
      })) || [];
      

        // ✅ Fix Main Form Structure
        const fixedForm: FormularioExterno = {
            id: form.id || 'NA',
            comment: form.comment || '',
            createdOn: Date.now().toString(),
            createdBy: form.createdBy || "NA",
            modifiedOn: Date.now().toString(),
            modifiedBy: form.modifiedBy || "NA",
            closed: false,
            step: "-",
            requests: requests,
            applicant: applicant,
            applicantViewer: "-",
            file1: form.file1 || "",
            file2: form.file2 || "",
            file3: form.file3 || "",
            file4: form.file4 || "",
            file5: form.file5 || "",
            file6: form.file6 || "",
            status: "PENDING",
            formType: formType,
            createdName: form.createdName || "Unknown"
        };

        // ✅ Send Fixed Request
        const res = await lastValueFrom(this.apiService.request<FormularioExterno>('POST', 'dga/form', { body: fixedForm }));

        if (!res.id) return false;

        await this.enviarSolicitudes(res.id, requests); // ✅ Fixed missing argument issue
        return res.id;
    } catch (error) {
        this.spinner.hide();
        const err = error as any;
        Swal.fire('Error', 'Error al procesar la solicitud: ' + err.message, 'error');
        return false;
    }
}

  

  async enviarSolicitudes(formId: string, requests: Request[]): Promise<void> {
    try {
      for (const req of requests) {
        req.createBy = this.getUserLogin() ?? 'NA';
        req.createOn = Date.now().toString();
        req.state = 'PENDING';
        req.approveDate = '';
        req.hashCode = '';
        req.deleteAllGroups = 'false';
        req.moveToDesactive = 'false';

        req.profiles = req.profiles.map(profile => ({
          id: '',
          profile: { id: 'PRF-001', value: profile.profile.value, status: 'ENABLED' },
          status: 'ENABLED',
          custom: { id: 'ADU-001', value: profile.custom.value, status: 'ENABLED' },
          endDate: profile.endDate,
          startDate: profile.startDate || Date.now().toString(),
          temporal: false,
          type: 'User Access'
        }));

        req.systems = req.systems.map(system => ({
          id: '',
          status: system.status,
          temporal: false,
          type: 'System Access',
          startDate: system.startDate || Date.now().toString(),
          endDate: system.endDate,
          group: {
            id: 'GRP-001',
            value: 'Main Group',
            status: 'ENABLED',
            system: { id: 'SYS-001', value: system.group.value, status: 'ENABLED' }
          },
          custom: { id: 'NA', value: 'N/A', status: 'ENABLED' }
        }));

        req.person = {
          document: req.person.document,
          mail: req.person.mail,
          uid: '',
          position: { id: 'NA', value: 'N/A', status: 'ENABLED' },
          levelOne: { id: 'NA', value: 'N/A', status: 'ENABLED' },
          levelTwo: { id: 'NA', value: 'N/A', status: 'ENABLED' },
          levelThree: { id: 'NA', value: 'N/A', status: 'ENABLED' },
          levelFour: { id: 'NA', value: 'N/A', status: 'ENABLED' },
          startDate: req.person.startDate || Date.now().toString(),
          endDate: req.person.endDate || '',
          attribute: { id: 'NA', value: 'N/A', status: 'ENABLED' },
          typeAFPA: { id: 'NA', value: 'N/A', status: 'ENABLED' },
          isAFPA: false,
          resolution: '',
          codeDeclarant: '',
          id: 'PER-8832',
          approveAFPA: '',
          fullName: req.person.fullName,
          lastName: req.person.lastName,
          surName: req.person.surName,
          userType: 'Externo',
          organizationCode: 'DGA Externo',
          phoneNumber: req.person.phoneNumber,
          alternativeMail: req.person.alternativeMail || '',
          mobile: req.person.mobile,
          state: 'ACTIVE'
        };

        await lastValueFrom(this.apiService.request<Request>('POST', `dga/form/request/${formId}`, { body: req }));
      }
    } catch (error) {
      Swal.fire('Error', 'Error al enviar la solicitud: ' + (error as any).message, 'error');
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
