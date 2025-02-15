import { CommonAttribute } from "../../../../models/common-attribute.model";

export interface Applicant {
  document: string;
  position: CommonAttribute;
  attribute: CommonAttribute;
  externalType?: CommonAttribute;
  name: string;
  externalName?: string;
  externalRepLegal: string;
  externalCodeDeclarant: string;
  mail: string;
  id: string;
  userType?: string;
}
