import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { Aduana } from "../components/perfil/models/aduana.model";
import { CommonAttribute } from "../models/common-attribute.model";
import { Applicant } from "../pages/formulario-externo/models/applicant.model";
import { FormularioExterno } from "../pages/formulario-externo/models/formulario-externo.model";
import { Request } from "../pages/formulario-externo/models/request.model";
import { Roles } from "../enums/roles.enum";

export function limpiarPayload(payload: FormularioExterno, tipoUsuario: Roles = Roles.NOAFPA): Partial<FormularioExterno> {
  let result: any = Array.isArray(payload) ? [] : {};
  for (const key in payload) {
    if (payload.hasOwnProperty(key)) {
      const value = payload[key as keyof FormularioExterno];
      if (typeof value === 'string' && value.trim() === '') {
        continue;
      } else if (typeof value === 'string' && esFecha(value)) {
        result[key] = convertirASse(value);
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          result[key] = {};
        } else {
          result[key] = limpiarPayload(value as unknown as FormularioExterno, tipoUsuario);
        }
      } else if (typeof value === 'object' && value !== null && tipoUsuario !== Roles.INTERNO) {
        if (
          'id' in value &&
          'status' in value &&
          'value' in value &&
          value.value === 'N/A'
        ) {
          result[key] = {};
        } else {
          result[key] = limpiarPayload(value as unknown as FormularioExterno, tipoUsuario);
        }
      } else {
        result[key] = value;
      }
    }
  }

  (result as Partial<FormularioExterno>).requests = (result as Partial<FormularioExterno>).requests?.filter((r) => r.id !== 'NUEVA');
  return result as Partial<FormularioExterno>;
}

export function esFecha(value: string): boolean {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  return datePattern.test(value);
}

export function convertirASse(dateString: string): string {
  if (dateString.length) {
    const date = new Date(dateString);
    return Math.floor(date.getTime()).toString();
  } else return '';
}

export function formularioExternoVacio(formType: string, createdBy: string = ''): FormularioExterno {
  return {
    id: '',
    createdOn: '',
    createdBy,
    modifiedOn: '',
    modifiedBy: '',
    closed: false,
    step: '-',
    comment: '',
    requests: [solicitudNueva()],
    applicant: applicant(),
    applicantViewer: '-',
    file1: '',
    file2: '',
    file3: '',
    file4: '',
    file5: '',
    file6: '',
    status: 'PENDING',
    formType
  }
}

export function solicitudNueva(): Request {
  return {
    id: 'NUEVA',
    typeRequest: {
      id: '',
      status: '',
      value: '',
    },
    state: 'PENDIENTE DE ASIGNAR',
    createBy: '',
    createOn: '',
    approveDate: '',
    profiles: [],
    resources: [],
    systems: [],
    others: [],
    flow: [],
    person: {
      document: '',
      mail: '',
      uid: '',
      position: {
        id: '',
        status: '',
        value: '',
      },
      levelOne: {
        id: '',
        status: '',
        value: '',
      },
      levelTwo: {
        id: '',
        status: '',
        value: '',
      },
      levelThree: {
        id: '',
        status: '',
        value: '',
      },
      levelFour: {
        id: '',
        status: '',
        value: '',
      },
      startDate: '',
      endDate: '',
      attribute: {
        id: '',
        status: '',
        value: '',
      },
      typeAFPA: {
        id: '',
        status: '',
        value: '',
      },
      isAFPA: false,
      resolution: '',
      codeDeclarant: '',
      id: '',
      approveAFPA: '',
      fullName: '',
      lastName: '',
      surName: '',
      phoneNumber: '',
      alternativeMail: '',
      mobile: '',
      organizationCode: '',
      state: '',
      userType: ''
    },
  }
}

export function applicant(): Applicant {
  return {
    document: '',
    position: {
      id: '',
      value: '',
      status: ''
    },
    attribute: {
      id: '',
      value: '',
      status: ''
    },
    externalType: {
      id: '',
      value: '',
      status: ''
    },
    name: '',
    externalName: '',
    externalRepLegal: '',
    externalCodeDeclarant: '',
    mail: '',
    id: ''
  }
}

export function permitidoTerminar(f: FormularioExterno, r: Request): boolean {
  if (!getStepIsServiceDesk(f)) return true;
  if (r.helpDeskId !== null) return true;
  return false;
}

export function getStepIsServiceDesk(f: FormularioExterno): boolean {
  if (f.step === null) return false;
  return f.step.includes('SERVICIO_AL_CLIENTE');
}

export function aduanaVacia(): Aduana {
  return commonAttribute();
}

export function commonAttribute(): CommonAttribute {
  return {
    id: 'NA',
    status: 'ENABLED',
    value: 'N/A',
  }
}

export function obtenerValor<T>(arreglo: T[], parametroBusqueda: string, valor: string): T {
  return arreglo.find((a) => a[parametroBusqueda as keyof T] === valor) as T;
}

export function crearFormularioVacio<T>(
  model?: Partial<T>,
  validations: { [K in keyof T]?: ValidatorFn[] } = {},
  defaultValues?: Partial<T>
): FormGroup {
  const group: { [key: string]: AbstractControl } = {};

  const inferredModel = model ? model : ({} as T);

  for (const key in inferredModel) {
    if (Object.prototype.hasOwnProperty.call(inferredModel, key)) {
      let controlValue: any;

      if (defaultValues && key in defaultValues) {
        controlValue = defaultValues[key as keyof T];
      } else {
        const field = inferredModel[key as keyof T];

        if (typeof field === 'string' || typeof inferredModel[key as keyof T] === 'string') {
          controlValue = '';
        } else if (typeof field === 'number' || typeof inferredModel[key as keyof T] === 'number') {
          controlValue = 0;
        } else if (Array.isArray(field) || Array.isArray(inferredModel[key as keyof T])) {
          controlValue = [];
        } else if (typeof field === 'object' && field !== null) {
          controlValue = crearFormularioVacio(
            field as any,
            validations[key as keyof T] as any,
            defaultValues ? (defaultValues[key as keyof T] as any) : undefined
          );
        } else {
          controlValue = '';
        }
      }

      group[key] = new FormControl(controlValue, validations[key as keyof T] || []);
    }
  }
  return new FormGroup(group);
}
