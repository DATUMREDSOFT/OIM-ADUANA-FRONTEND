import { CommonAttribute } from "../../../models/common-attribute.model";
import { Flow } from "./flow.model";
import { Other } from "./other.model";
import { Person } from "./person.model";
import { Profile } from "./profile.model";
import { Resource } from "./resource.model";
import { System } from "./system.model";

export interface Request {
    id: string;
    typeRequest: CommonAttribute;
    state: string;
    createBy: string;
    createOn: string;
    approveDate: string;
    profiles: Profile[];
    resources: Resource[];
    systems: System[];
    others: Other[];
    flow: Flow[];
    person: Person;
    helpDeskId?: string;
    hashCode?: string;
    password?: string;
    deleteAllGroups?: string;
    moveToDesactive?: string;
}