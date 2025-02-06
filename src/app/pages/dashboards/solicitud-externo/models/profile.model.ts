import { CommonAttribute } from "../../../models/common-attribute.model";

export interface Profile {
  id: string;
  profile: CommonAttribute;
  status: string;
  custom: CommonAttribute;
  endDate: string;
  temporal?: boolean;
  type: string;
  startDate: string;
}
