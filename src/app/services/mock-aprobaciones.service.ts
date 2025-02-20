import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Request} from "../enums/request.enum";
import {ApiService} from "./api.service";
import {TipoUsuarioService} from "./tipo-usuario.service";

@Injectable({
  providedIn: 'root'
})
export class MockAprobacionesService {

  constructor(private http: HttpClient, private api: ApiService, private tipoUsuarioService: TipoUsuarioService) {
  }



  getSolicitudes(): Observable<any[]> {
    const mockData = [
      {
        "id": "DGA-674",
        "createdOn": "1725925509000",
        "createdBy": "KOBE.BRYANT",
        "modifiedOn": "1725925509000",
        "modifiedBy": "KOBE.BRYANT",
        "closed": false,
        "step": "Formulario - Aprobación de Servicio al Cliente",
        "comment": null,
        "requests": [],
        "applicant": {
          "document": "13121306430019",
          "position": null,
          "attribute": null,
          "externalType": null,
          "name": "JOSE ARGELIO FLORES ALVAREZ",
          "externalName": null,
          "externalRepLegal": null,
          "externalCodeDeclarant": null,
          "mail": "415986@comprasal.gob.sv",
          "id": "APP-674"
        },
        "applicantViewer": "011631084",
        "file1": null,
        "file2": null,
        "file3": null,
        "file4": null,
        "file5": null,
        "file6": null,
        "status": "PENDING",
        "formType": "Externo",
        "createdName": null,
        "roleStep": "SERVICIO_AL_CLIENTE"
      },
      {
        "id": "DGA-686",
        "createdOn": "1725955429000",
        "createdBy": "KOBE.BRYANT",
        "modifiedOn": "1725955429000",
        "modifiedBy": "KOBE.BRYANT",
        "closed": false,
        "step": "Formulario - Aprobación de Servicio al Cliente",
        "comment": null,
        "requests": [],
        "applicant": {
          "document": "13121306430019",
          "position": null,
          "attribute": null,
          "externalType": null,
          "name": "JOSE ARGELIO FLORES ALVAREZ",
          "externalName": null,
          "externalRepLegal": null,
          "externalCodeDeclarant": null,
          "mail": "415986@comprasal.gob.sv",
          "id": "APP-686"
        },
        "applicantViewer": "011631084",
        "file1": null,
        "file2": null,
        "file3": null,
        "file4": null,
        "file5": null,
        "file6": null,
        "status": "PENDING",
        "formType": "Externo",
        "createdName": null,
        "roleStep": "SERVICIO_AL_CLIENTE"
      },
      {
        "id": "DGA-687",
        "createdOn": "1725955429001",
        "createdBy": "KOBE.BRYANT",
        "modifiedOn": "1725955429001",
        "modifiedBy": "KOBE.BRYANT",
        "closed": false,
        "step": "Formulario - Aprobación de Servicio al Cliente",
        "comment": null,
        "requests": [],
        "applicant": {
          "document": "13121306430020",
          "position": null,
          "attribute": null,
          "externalType": null,
          "name": "MARTA LORENA GARCIA",
          "externalName": null,
          "externalRepLegal": null,
          "externalCodeDeclarant": null,
          "mail": "mlorena@comprasal.gob.sv",
          "id": "APP-687"
        },
        "applicantViewer": "011631084",
        "file1": null,
        "file2": null,
        "file3": null,
        "file4": null,
        "file5": null,
        "file6": null,
        "status": "PENDING",
        "formType": "Externo",
        "createdName": null,
        "roleStep": "SERVICIO_AL_CLIENTE"
      },
      {
        "id": "DGA-688",
        "createdOn": "1725955429002",
        "createdBy": "KOBE.BRYANT",
        "modifiedOn": "1725955429002",
        "modifiedBy": "KOBE.BRYANT",
        "closed": false,
        "step": "Formulario - Aprobación de Servicio al Cliente",
        "comment": null,
        "requests": [],
        "applicant": {
          "document": "13121306430021",
          "position": null,
          "attribute": null,
          "externalType": null,
          "name": "PEDRO MIGUEL SANCHEZ",
          "externalName": null,
          "externalRepLegal": null,
          "externalCodeDeclarant": null,
          "mail": "pmsanchez@comprasal.gob.sv",
          "id": "APP-688"
        },
        "applicantViewer": "011631084",
        "file1": null,
        "file2": null,
        "file3": null,
        "file4": null,
        "file5": null,
        "file6": null,
        "status": "PENDING",
        "formType": "Externo",
        "createdName": null,
        "roleStep": "SERVICIO_AL_CLIENTE"
      },
      {
        "id": "DGA-689",
        "createdOn": "1725955429003",
        "createdBy": "KOBE.BRYANT",
        "modifiedOn": "1725955429003",
        "modifiedBy": "KOBE.BRYANT",
        "closed": false,
        "step": "Formulario - Aprobación de Servicio al Cliente",
        "comment": null,
        "requests": [],
        "applicant": {
          "document": "13121306430022",
          "position": null,
          "attribute": null,
          "externalType": null,
          "name": "CARLOS ENRIQUE PEREZ",
          "externalName": null,
          "externalRepLegal": null,
          "externalCodeDeclarant": null,
          "mail": "ceperez@comprasal.gob.sv",
          "id": "APP-689"
        },
        "applicantViewer": "011631084",
        "file1": null,
        "file2": null,
        "file3": null,
        "file4": null,
        "file5": null,
        "file6": null,
        "status": "PENDING",
        "formType": "Externo",
        "createdName": null,
        "roleStep": "SERVICIO_AL_CLIENTE"
      },
      {
        "id": "DGA-690",
        "createdOn": "1725955429004",
        "createdBy": "KOBE.BRYANT",
        "modifiedOn": "1725955429004",
        "modifiedBy": "KOBE.BRYANT",
        "closed": false,
        "step": "Formulario - Aprobación de Servicio al Cliente",
        "comment": null,
        "requests": [],
        "applicant": {
          "document": "13121306430023",
          "position": null,
          "attribute": null,
          "externalType": null,
          "name": "ANA MARIA LOPEZ",
          "externalName": null,
          "externalRepLegal": null,
          "externalCodeDeclarant": null,
          "mail": "amlopez@comprasal.gob.sv",
          "id": "APP-690"
        },
        "applicantViewer": "011631084",
        "file1": null,
        "file2": null,
        "file3": null,
        "file4": null,
        "file5": null,
        "file6": null,
        "status": "PENDING",
        "formType": "PENDING",
        "createdName": null,
        "roleStep": "SERVICIO_AL_CLIENTE"
      },
      {
        "id": "DGA-691",
        "createdOn": "1725955429005",
        "createdBy": "KOBE.BRYANT",
        "modifiedOn": "1725955429005",
        "modifiedBy": "KOBE.BRYANT",
        "closed": false,
        "step": "Formulario - Aprobación de Servicio al Cliente",
        "comment": null,
        "requests": [],
        "applicant": {
          "document": "13121306430024",
          "position": null,
          "attribute": null,
          "externalType": null,
          "name": "JUAN CARLOS MARTINEZ",
          "externalName": null,
          "externalRepLegal": null,
          "externalCodeDeclarant": null,
          "mail": "jcmartinez@comprasal.gob.sv",
          "id": "APP-691"
        },
        "applicantViewer": "011631084",
        "file1": null,
        "file2": null,
        "file3": null,
        "file4": null,
        "file5": null,
        "file6": null,
        "status": "PENDING",
        "formType": "Externo",
        "createdName": null,
        "roleStep": "SERVICIO_AL_CLIENTE"
      },
      {
        "id": "DGA-692",
        "createdOn": "1725955429006",
        "createdBy": "KOBE.BRYANT",
        "modifiedOn": "1725955429006",
        "modifiedBy": "KOBE.BRYANT",
        "closed": false,
        "step": "Formulario - Aprobación de Servicio al Cliente",
        "comment": null,
        "requests": [],
        "applicant": {
          "document": "13121306430025",
          "position": null,
          "attribute": null,
          "externalType": null,
          "name": "MARIA FERNANDA GOMEZ",
          "externalName": null,
          "externalRepLegal": null,
          "externalCodeDeclarant": null,
          "mail": "mfgomez@comprasal.gob.sv",
          "id": "APP-692"
        },
        "applicantViewer": "011631084",
        "file1": null,
        "file2": null,
        "file3": null,
        "file4": null,
        "file5": null,
        "file6": null,
        "status": "PENDING",
        "formType": "Externo",
        "createdName": null,
        "roleStep": "SERVICIO_AL_CLIENTE"
      },
      {
        "id": "DGA-693",
        "createdOn": "1725955429007",
        "createdBy": "KOBE.BRYANT",
        "modifiedOn": "1725955429007",
        "modifiedBy": "KOBE.BRYANT",
        "closed": false,
        "step": "Formulario - Aprobación de Servicio al Cliente",
        "comment": null,
        "requests": [],
        "applicant": {
          "document": "13121306430026",
          "position": null,
          "attribute": null,
          "externalType": null,
          "name": "LUIS ALBERTO RIVERA",
          "externalName": null,
          "externalRepLegal": null,
          "externalCodeDeclarant": null,
          "mail": "larivera@comprasal.gob.sv",
          "id": "APP-693"
        },
        "applicantViewer": "011631084",
        "file1": null,
        "file2": null,
        "file3": null,
        "file4": null,
        "file5": null,
        "file6": null,
        "status": "PENDING",
        "formType": "Externo",
        "createdName": null,
        "roleStep": "SERVICIO_AL_CLIENTE"
      },
      {
        "id": "DGA-694",
        "createdOn": "1725955429008",
        "createdBy": "KOBE.BRYANT",
        "modifiedOn": "1725955429008",
        "modifiedBy": "KOBE.BRYANT",
        "closed": false,
        "step": "Formulario - Aprobación de Servicio al Cliente",
        "comment": null,
        "requests": [],
        "applicant": {
          "document": "13121306430027",
          "position": null,
          "attribute": null,
          "externalType": null,
          "name": "SOFIA ANDREA MENDEZ",
          "externalName": null,
          "externalRepLegal": null,
          "externalCodeDeclarant": null,
          "mail": "samendez@comprasal.gob.sv",
          "id": "APP-694"
        },
        "applicantViewer": "011631084",
        "file1": null,
        "file2": null,
        "file3": null,
        "file4": null,
        "file5": null,
        "file6": null,
        "status": "PENDING",
        "formType": "Externo",
        "createdName": null,
        "roleStep": "SERVICIO_AL_CLIENTE"
      }
    ];


    return of(mockData);
  }





  getAllRequests(): Observable<any[]> {

    const roles = this.tipoUsuarioService.getTipoUsuario();

    // const url = `dga/dashboard/pending/USC,ELABORADOR,APROBADOR,SERVICIO_AL_CLIENTE,null,-/KOBE.BRYANT`;
    const url = `dga/dashboard/pending/${roles}/KOBE.BRYANT`;
    // const url = `dga/dashboard/pending/${rol}/${uuid}`;
    return this.api.request<any>(Request.GET, url);
  }



  getSolicitudDetalle(defaultId: any): Observable<any> {
    const url = `dga/dashboard/form/load/${defaultId}`;
    return this.api.request<any>(Request.GET, url);
  }


  getUtilAccount(requestId: any): Observable<any> {
    const url = `/util/account/${requestId}`;
    return this.api.request<any>(Request.GET, url);
  }

}
