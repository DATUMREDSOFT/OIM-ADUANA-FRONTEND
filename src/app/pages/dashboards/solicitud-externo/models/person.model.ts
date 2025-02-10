import { CommonAttribute } from "../../../../models/common-attribute.model";

export interface Person {
  document: string;
  mail: string;
  uid: string;
  position: CommonAttribute;
  levelOne: CommonAttribute;
  levelTwo: CommonAttribute;
  levelThree: CommonAttribute;
  levelFour: CommonAttribute;
  startDate: string;
  endDate: string;
  attribute: CommonAttribute;
  typeAFPA?: CommonAttribute;
  isAFPA?: boolean;
  resolution: string;
  codeDeclarant?: string;
  id: string;
  approveAFPA?: string;
  fullName: string;
  lastName: string;
  surName: string;
  alternativeMail: string;
  mobile: string;
  organizationCode: string;
  phoneNumber: string;
  state: string;
  userType: string;
}
