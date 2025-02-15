import { AbstractControl, ValidatorFn } from '@angular/forms';
import { commonAttribute } from './formularios.util';
import { SolicitanteSolicitud } from '../components/solicitud/models/solicitante-solicitud.model';
import { Request } from '../components/tareas-pendientes/models/formulario-cargado.interface';
import { Request as Request2 } from '../pages/formulario-externo/models/request.model';
import { Propiedad } from '../components/datos-propiedades/datos-propiedades.component';

export const estados: { [ket: string]: string } = {
  PENDING: 'PENDIENTE',
  NOTSTARTED: 'NO INICIADO',
  FINISH: 'FINALIZADO',
  APPROVE: 'APROBADO',
  REJECT: 'RECHAZADO'
};

export const userDefault: SolicitanteSolicitud = {
  document: '',
  surName: '',
  lastName: '',
  uid: '',
  mail: '',
  phoneNumber: '',
  mobile: '',
  alternativeMail: '',
  fullName: '',
  position: commonAttribute(),
  attribute: commonAttribute(),
  levelFour: commonAttribute(),
  levelOne: commonAttribute(),
  levelThree: commonAttribute(),
  levelTwo: commonAttribute(),
  organizationCode: 'DGA Externo',
  state: 'Active',
  userType: 'EXTERNO DGA',
  typeAFPA: commonAttribute(),
  resolution: '',
  codeDeclarant: '',
  approveAFPA: '',
  isAFPA: false
}

export const applicantDefault = {
  attribute: {
    id: 'NA',
    status: 'ENABLED',
    value: 'N/A'
  },
  externalType: {},
  name: '',
  externalCodeDeclarant: '',
  position: {
    id: 'NA',
    status: 'ENABLED',
    value: 'N/A'
  }
}

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const value = control.value || '';

    if (value.length < 1) return null;

    const valid = emailRegex.test(value);
    return valid ? null : { invalidEmail: true };
  };
}

export function convertEpochToDate(epochSeconds: number): string {
  if (!epochSeconds) return '';
  const date = new Date(epochSeconds);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const dayFormatted = day < 10 ? '0' + day : day;
  const monthFormatted = month < 10 ? '0' + month : month;

  return `${dayFormatted}/${monthFormatted}/${year}`;
}

export function generarResumen(req: Partial<Request | Request2>, propiedades?: Propiedad[]): string {
  let resumen: string = '<table class="table-borderless" style="border: none!important">';
  resumen += `<tr><td>Se solicita:</td><td></td></tr>`;
  resumen += '</table>';
  resumen += '<table class="table-borderless" style="border: none!important">';
  resumen += `<tr><td style="font-weight: bolder!impcoortant; text-align: left!important;">${req.typeRequest?.value}:</td><td>${req.person?.surName?.split(' ')?.[0] ?? req.person?.surName?.split(' ')?.[1] ?? ''} ${req.person?.lastName?.split(' ')?.[0] ?? req.person?.lastName?.split(' ')?.[1] ?? ''}</td></tr>`;
  if (req.profiles?.length || req.systems?.length || propiedades?.length) {
    if (req.profiles?.length) resumen += req.profiles.map((p) => `<tr><td style="color: ${JSON.stringify(p).includes('BORRAR') ? 'red' : 'green'}!important; font-weight: bolder!important; text-align: left!important;">Perfil: </td><td>${p.profile.value} - ${p.profile.id}</td></tr>`);
    if (req.systems?.length) resumen += req.systems.map((sys) => `<tr><td style="color: ${JSON.stringify(req).includes('BORRAR') ? 'red' : 'green'}!important; font-weight: bolder!important; text-align: left!important;">Sistema: </td><td>${sys.group.value}${sys.custom.id.length ? ' - ' + sys.custom.id : ''}</td></tr>`);
    if (propiedades?.length) resumen += propiedades.map((pr) => `<tr><td style="color: ${JSON.stringify(pr).includes('BORRAR') ? 'red' : 'green'}!important; font-weight: bolder!important; text-align: left!important;">Propiedad: ${pr.llave}</td><td>Valor: ${pr.valor}</td></tr>`);
  }
  resumen += '</table>';

  return resumen;
}
