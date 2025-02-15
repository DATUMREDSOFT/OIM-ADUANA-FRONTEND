import { CommonAttribute } from "../../../../models/common-attribute.model";

export interface System {
  catSysId?: string;
  custom: CommonAttribute;
  endDate: string;
  group: CommonAttribute;
  id: string;
  startDate: string;
  status: string;
  type: string;
  temporal?: boolean;
}
