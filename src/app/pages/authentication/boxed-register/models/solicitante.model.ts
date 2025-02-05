import { CommonAttribute } from '../../../../models/common-attribute.model';

export interface Solicitante {
  attribute: CommonAttribute;
  externalType: CommonAttribute;
  name: string;
  position: CommonAttribute;
  document?: string;
  mail?: string;
  externalCodeDeclarant?: string;
}