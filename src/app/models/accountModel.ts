export interface AccountModel {
    id: string;
    name: string;
    type: string;
    request: string;
    login: string;
    resource: string;
    requestId: string;
    resourceId: string;
    isNew: boolean;
}

export interface AccountFormSelectModel {
    id: boolean;
    valor: string;
}