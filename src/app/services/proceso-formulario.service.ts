import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FormularioExterno } from '../pages/dashboards/solicitud-base/models/formulario-externo.model';
import { Request as Req } from '../enums/request.enum';
import { Request } from '../pages/dashboards/solicitud-base/models/request.model';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';
import { TipoUsuarioService } from './tipo-usuario.service';
import { Roles } from '../enums/roles.enum';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProcesoFormularioService {
  private readonly apiService = inject(ApiService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly tipoUsuario = inject(TipoUsuarioService);
  private readonly localStorageService = inject(LocalStorageService);

  /** ✅ **Get Logged-in User from Local Storage** */
  getUserLogin(): string {
    const storedUser = this.localStorageService.getItem<{ value: string }>('usuario-logeado');
    return storedUser?.value || 'NA';
  }

  /** ✅ **Start Process** - Builds and Sends Parent Form */
  async iniciarProceso(form: Partial<FormularioExterno>): Promise<string | boolean> {
    try {
      this.spinner.show();

      // ✅ Determine User Type
      const userType = this.tipoUsuario.getTipoUsuario();
      const formType = userType === Roles.NOAFPA ? 'Externo' : 'Interno';

      // ✅ Extract Applicant Data
      const applicant = this.formatApplicant(form.applicant);

      // ✅ Extract Requests
      const requests = form.requests ? form.requests.map(req => this.formatRequest(req, userType)) : [];

      // ✅ Construct Parent Form
      const fixedForm: FormularioExterno = {
        id: form.id || 'NA',
        comment: form.comment || '',
        createdOn: Date.now().toString(),
        createdBy: form.createdBy || this.getUserLogin(),
        modifiedOn: Date.now().toString(),
        modifiedBy: form.modifiedBy || this.getUserLogin(),
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

      console.log('🚀 Sending Parent Form:', fixedForm);
      const res = await lastValueFrom(this.apiService.request<FormularioExterno>('POST', 'dga/form', { body: fixedForm }));

      if (!res.id) return false;

      await this.enviarSolicitudes(res.id, requests);
      this.spinner.hide();
      return res.id;
    } catch (error) {
      this.spinner.hide();
      console.error('❌ Error processing form:', error);
      Swal.fire('Error', 'Error al procesar la solicitud', 'error');
      return false;
    }
  }

  /** ✅ **Format Applicant** */
  private formatApplicant(applicant: any): any {
    return {
      document: applicant?.document || "NA",
      position: { id: "NA", value: applicant?.position || "N/A", status: "ENABLED" },
      attribute: { id: "NA", value: "N/A", status: "ENABLED" },
      externalType: { id: "PERSONAL", value: "Persona Natural", status: "ENABLED" },
      name: applicant?.name || "Unknown",
      mail: applicant?.mail || "unknown@example.com"
    };
}


  /** ✅ **Format Request** (Handles NOAFPA and AFPA users) */
  private formatRequest(req: Request, userType: string): Request {
    return {
      id: req.id || "Pendiente de guardar",
      typeRequest: { id: req.typeRequest?.id || "TYREQ-1", value: req.typeRequest?.value || "Nuevo Usuario" },
      state: "PENDING",
      createBy: this.getUserLogin(),
      createOn: Date.now().toString(),
      approveDate: req.approveDate || Date.now().toString(),
      profiles: userType === Roles.NOAFPA ? [] : req.profiles || [], // 🔥 NOAFPA Users Can't Send Profiles
      resources: userType === Roles.NOAFPA ? [] : req.resources || [], // 🔥 NOAFPA Users Can't Send Resources
      systems: req.systems ? req.systems.map(system => this.formatSystem(system)) : [],
      others: [],
      flow: [],
      person: this.formatPerson(req.person)
    };
  }

  /** ✅ **Format System** (Keeps full details) */
  private formatSystem(system: any): any {
    return {
      id: system.id || "CATSYS-12",
      status: system.status || "PENDIENTE DE ASIGNAR",
      type: "Externo",
      startDate: system.startDate || Date.now().toString(),
      endDate: system.endDate || Date.now().toString(),
      group: {
        id: system.group?.id || "CATGRP-78",
        status: system.group?.status || "ENABLED",
        value: system.group?.value || "PAGOES"
      },
      custom: { id: 'NA', value: 'N/A' }
    };
  }

  /** ✅ **Format Person** */
  private formatPerson(person: any): any {
    return {
      document: person.document,
      mail: person.mail,
      uid: person.uid || '',
      fullName: person.fullName,
      lastName: person.lastName,
      surName: person.surName,
      phoneNumber: person.phoneNumber,
      mobile: person.mobile,
      userType: "Externo"
    };
  }

  /** ✅ **Send Requests** */
  async enviarSolicitudes(formId: string, requests: Request[]): Promise<void> {
    try {
      for (const req of requests) {
        console.log(`🚀 Sending Request ${req.id} for Form ${formId}`);
        await lastValueFrom(this.apiService.request<Request>('POST', `dga/form/request/${formId}`, { body: req }));

        // 🔥 Handle additional submissions (profiles, systems, etc.)
        if (req.profiles.length) await this.enviarPerfiles(req);
        if (req.systems.length) await this.enviarSistemas(req);
        if (req.others.length) await this.enviarOtros(req);
        if (!requests.indexOf(req)) {
          await this.enviarFlow(req);
          await this.enviarEmail(req);
        }
      }
    } catch (error) {
      Swal.fire('Error', 'Error al enviar solicitudes', 'error');
    }
  }

  /** ✅ **Send Profiles** */
  async enviarPerfiles(req: Request): Promise<void> {
    for (const profile of req.profiles) {
      try {
        await lastValueFrom(this.apiService.request('POST', `dga/form/request/profile/${req.id}`, { body: profile }));
      } catch (error) {
        Swal.fire('Error', 'Error al enviar perfiles', 'error');
      }
    }
  }

  /** ✅ **Send Systems** */
  async enviarSistemas(req: Request): Promise<void> {
    for (const system of req.systems) {
      try {
        await lastValueFrom(this.apiService.request('POST', `dga/form/request/system/${req.id}`, { body: system }));
      } catch (error) {
        Swal.fire('Error', 'Error al enviar sistemas', 'error');
      }
    }
  }

  /** ✅ **Send Others** */
  async enviarOtros(req: Request): Promise<void> {
    for (const other of req.others) {
      try {
        await lastValueFrom(this.apiService.request('POST', `dga/form/request/other/${req.id}`, { body: other }));
      } catch (error) {
        Swal.fire('Error', 'Error al enviar otros', 'error');
      }
    }
  }

  /** ✅ **Send Flow** */
  async enviarFlow(req: Request): Promise<void> {
    await lastValueFrom(this.apiService.request('POST', `dga/flow?requestId=${req.id}&processId=NA`));
  }

  /** ✅ **Send Email** */
  async enviarEmail(req: Request): Promise<void> {
    await lastValueFrom(this.apiService.request('GET', `dga/flow/email?requestId=${req.id}`));
  }
}
