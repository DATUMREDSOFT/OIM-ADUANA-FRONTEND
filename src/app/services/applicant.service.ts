// applicant.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Request } from '../enums/request.enum';
import { FormType } from '../enums/form-type.enum';
import { Solicitante } from '../pages/authentication/boxed-register/models/solicitante.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TipoSolicitud } from '../pages/authentication/boxed-register/models/tipo-solicitud.model';
import { forkJoin } from 'rxjs';
import { CommonAttribute } from '../models/common-attribute.model';

@Injectable({ providedIn: 'root' })
export class ApplicantService {
  constructor(private api: ApiService) {}

  private mapSolicitanteResponse(response: any): Solicitante {
    return {
      attribute: this.parseAttribute(response.attribute),
      externalType: this.parseAttribute(response.externalType),
      name: response.name || '',
      position: this.parseAttribute(response.position),
      document: response.document,
      mail: response.mail,
      externalCodeDeclarant: response.externalCodeDeclarant
    };
  }

  private parseAttribute(attr: any): CommonAttribute {
    return attr?.id && attr?.status && attr?.value 
      ? attr 
      : { id: 'NA', status: 'ENABLED', value: 'N/A' };
  }

  validateApplicant(documentNumber: string, formType: FormType): Observable<Solicitante> {
    return this.api.request<any>(Request.GET, `dga/form/request/applicant/${formType}/${documentNumber}`).pipe(
      map(response => this.mapSolicitanteResponse(response))
    );
  }

  fullValidationFlow(documentNumber: string): Observable<Solicitante> {
    return this.validateApplicant(documentNumber, FormType.Elaborador).pipe(
      catchError(() => this.validateApplicant(documentNumber, FormType.Aplicante)),
      catchError(() => this.validateApplicant(documentNumber, FormType.AgenteAFPA)),
      catchError(() => this.validateApplicant(documentNumber, FormType.PersonalNoAFPA)),
      catchError(() => throwError(() => new Error('No applicant found')))
    );
  }

  getTiposSolicitud(tipo: string): Observable<TipoSolicitud[]> {
    return this.api.request<any[]>(Request.GET, `dga/form/requestype/list/${tipo}`).pipe(
      map(response => response.map(item => ({
        id: item.id,
        value: item.value || item.name, // Handle API field name variations
        status: item.status
      })))
    );
  }

  validateRepresentative(documentNumber: string, representativeDocument: string): Observable<[Solicitante, Solicitante]> {
    return forkJoin([
      this.fullValidationFlow(documentNumber),
      this.fullValidationFlow(representativeDocument)
    ]);
  }
}