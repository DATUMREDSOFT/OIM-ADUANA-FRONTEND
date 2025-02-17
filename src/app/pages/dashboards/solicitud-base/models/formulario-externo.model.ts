import { Applicant } from "./applicant.model";
import { Request } from "./request.model";

export interface FormularioExterno {
    id: string;
    createdOn: string;
    createdBy: string;
    modifiedOn: string;
    modifiedBy: string;
    closed: boolean;
    step: string;
    comment: string;
    requests: Request[];
    applicant: Applicant;
    applicantViewer: string;
    file1: string;
    file2: string;
    file3: string;
    file4: string;
    file5: string;
    file6: string;
    status: string;
    createdName?: string;
    formType?: string;
}