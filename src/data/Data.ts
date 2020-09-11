export enum SheetPage {
    Practitioner = 'Practitioner',
    Patient = "Patient",
    ClinicalImpression = "ClinicalImpression",
    FMH = "FMH",
    ServiceRequest = "ServiceRequest",
    Organisation = "Organisation",
    PractitionerRole = "PractitionerRole"
}

export type ResourceType = "Practitioner" | "Patient" | "ClinicalImpression" | "FamilyMemberHistory" | "ServiceRequest" | "Organization" | "PractitionerRole";

export type ParsedType = Practitioner | Patient | ClinicalImpression | FamilyMemberHistory | ServiceRequest | Organization | PractitionerRole;

export interface Meta {
    profile: string[];
}

export interface Type {
    coding: Coding[];
    text?: string;
}

export interface Identifier {
    use?: string;
    type: Type;
    value: string;
}

export interface Name {
    use: string;
    family: string;
    given: string[];
    prefix?: string[];
    suffix?: string[];
}
export interface Practitioner {
    resourceType: ResourceType;
    id: string;
    meta: Meta;
    identifier: Identifier[];
    name: Name[];
}

export interface Patient {
    resourceType: ResourceType;
    id: string;
    meta: Meta;
    extension: Extension[];
    identifier: Identifier[];
    active: boolean;
    name: Name[];
    birthDate: Date;
    gender: string;
    generalPractitioner: Reference[];
    managingOrganization: Reference;
}

export interface Extension {
    url: string;
    valueCoding?: Coding;
    valueReference?: Reference;
    valueBoolean?: boolean;
    valueAge?: ValueAge;
}

export interface Coding {
    system?: string;
    code: string;
    display: string;
}

export interface Reference {
    reference: string;
}

export interface ParsedData {
    page: SheetPage;
    data: ParsedType[];
    dependencies: SheetPage[];
}

export interface ClinicalImpression {
    resourceType: ResourceType;
    id: string;
    meta: Meta;
    extension: Extension[];
    status: string;
    subject: Assessor;
    date: Date;
    assessor: Assessor;
    investigation: Investigation[];
}

export interface Assessor {
    reference: string;
}

export interface ValueAge {
    value: number;
    unit: string;
    system: string;
    code: string;
}

export interface Investigation {
    code: Code;
    item: Assessor[];
}

export interface Code {
    coding?: Coding[];
    text?: string;
}

export interface FamilyMemberHistory {
    resourceType: ResourceType;
    id: string;
    meta: Meta;
    status: string;
    patient: Reference;
    relationship: Relationship;
    note: Note[];
}


export interface Note {
    text: string;
}

export interface Relationship {
    coding: Coding[];
}

export interface ServiceRequest {
    resourceType: ResourceType;
    id: string;
    meta: Meta;
    extension: Extension[];
    status: string;
    intent: string;
    authoredOn: Date;
    category: Category[];
    priority: string;
    code: Code;
    requester: Reference;
    subject: Reference;
}

export interface Category {
    text: string;
}

export interface Organization {
    resourceType: ResourceType;
    id: string;
    meta: Meta;
    name: string;
    alias: string[];
    type: Coding
}

export interface PractitionerRole {
    resourceType: ResourceType;
    id:           string;
    meta:         Meta;
    active:       boolean;
    practitioner: Reference;
    organization: Reference;
    telecom:      Telecom[];
    code:         Code[];
}

export interface Telecom {
    system: string;
    value:  string;
    use:    string;
    rank?:  number;
}
