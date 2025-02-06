// app.models.ts

import { Other } from "../pages/dashboards/solicitud-externo/models/other.model";

export interface Attribute {
    id: string;
    status: string;
    value: string;
}

export interface Position {
    id: string;
    status: string;
    value: string;
}

export interface Applicant {
    attribute: Attribute;
    document: string;
    id: string;
    mail: string;
    name: string;
    position: Position;
}

export interface Flow {
    flowId: string;
    id: string;
    startDate: string;
    status: string;
    endDate?: string;
    result?: string;
    user?: string;
}

export interface PersonAttribute {
    id: string;
    status: string;
    value: string;
}

export interface Level {
    id: string;
    status: string;
    value: string;
}

export interface PersonPosition {
    id: string;
    status: string;
    value: string;
}

export interface TypeAFPA {
    id: string;
    status: string;
    value: string;
}

export interface Person {
    attribute: PersonAttribute;
    alternativeMail?: string;
    document: string;
    endDate: string;
    FullName: string;
    id: string;
    isAFPA: boolean;
    lastName: string;
    levelFour: Level;
    levelOne: Level;
    levelThree: Level;
    levelTwo: Level;
    mail: string;
    mobile: string;
    organizationCode: string;
    phoneNumber: string;
    position: PersonPosition;
    startDate: string;
    surName: string;
    typeAFPA: TypeAFPA;
    uid: string;
    userType: string;
}

export interface Custom {
    id: string;
    status: string;
    value: string;
}

export interface Group {
    id: string;
    status: string;
    value: string;
}

export interface System {
    custom: Custom;
    endDate: string;
    group: Group;
    id: string;
    startDate: string;
    status: string;
    temporal: boolean;
    type: string;
}

export interface TypeRequest {
    id: string;
    status: string;
    value: string;
}

export interface RequestModel {
    createBy: string;
    createOn: string;
    deleteAllGroups: boolean;
    flow: Flow[];
    hashCode: string;
    helpDeskId: string;
    id: string;
    moveToDesactive: boolean;
    others: Other[];
    password: string;
    person: Person;
    profiles: any[];
    resources: any[];
    state: string;
    systems: System[];
    typeRequest: TypeRequest;
}

export interface ConsultaRequestModel {
    applicant: Applicant;
    applicantViewer: string;
    closed: boolean;
    comment: string;
    createdBy: string;
    createdName: string;
    createdOn: string;
    formType: string;
    id: string;
    modifiedBy: string;
    modifiedOn: string;
    requests: RequestModel[];
    roleStep: string;
    status: string;
    step: string;
}
