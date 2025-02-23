import { CommonAttribute } from "../../../../models/common-attribute.model";
import { Other } from "./other.model";
import { Profile } from "./profile.model";
import { System } from "./system.model";

export interface SolicitanteSolicitud {
  alternativeMail: string;
  attribute: CommonAttribute;
  document: string;
  fullName: string;
  lastName: string;
  levelFour: CommonAttribute;
  levelOne: CommonAttribute;
  levelThree: CommonAttribute;
  levelTwo: CommonAttribute;
  mail: string;
  mobile: string;
  organizationCode: string;
  phoneNumber: string;
  position: CommonAttribute;
  state: string;
  surName: string;
  uid: string;
  userType: string;
  typeAFPA?: CommonAttribute;
  resolution?: string;
  codeDeclarant?: string;
  approveAFPA?: string;
  isAFPA?: boolean;
  startDate?: string;
  endDate?: string;
  catProfile?: Profile[];
  catSystem?: System[];
  otherDireccion?: Other[];
}
