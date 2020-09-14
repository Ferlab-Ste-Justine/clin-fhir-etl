export enum SheetPage {
    Practitioner = 'Practitioner',
    Patient = "Patient",
    Observation = "Observation",
    ClinicalImpression = "ClinicalImpression",
    FMH = "FMH",
    ServiceRequest = "ServiceRequest",
    Organisation = "Organisation",
    PractitionerRole = "PractitionerRole"
}

export type ResourceType = "Practitioner" | "Patient" | "Observation" | "ClinicalImpression" | "FamilyMemberHistory" | "ServiceRequest" | "Organization" | "PractitionerRole";

export type ParsedType = Practitioner | Patient | Observation | ClinicalImpression | FamilyMemberHistory | ServiceRequest | Organization | PractitionerRole;

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


export interface ValueAge {
    value: number;
    unit: string;
    system: string;
    code: string;
}

export interface Investigation {
    code: Code;
    item: Reference[];
}

export interface Code {
    coding?: Coding[];
    text?: string;
}

export interface Note {
    text: string;
}

export interface Relationship {
    coding: Coding[];
}

export interface Category {
    text: string;
}

export interface Telecom {
    system: string;
    value: string;
    use: string;
    rank?: number;
}

export interface Interpretation {
    coding: Coding[];
    text: string;
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
    birthDate: string;
    gender: string;
    generalPractitioner: Reference[];
    managingOrganization: Reference;
}

export interface ClinicalImpression {
    resourceType: ResourceType;
    id: string;
    meta: Meta;
    extension: Extension[];
    status: string;
    subject: Reference;
    date: string;
    assessor: Reference;
    investigation: Investigation[];
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

export interface ServiceRequest {
    resourceType: ResourceType;
    id: string;
    meta: Meta;
    extension: Extension[];
    status: string;
    intent: string;
    authoredOn: string;
    category: Category[];
    priority: string;
    code: Code;
    requester: Reference;
    subject: Reference;
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
    id: string;
    meta: Meta;
    active: boolean;
    practitioner: Reference;
    organization: Reference;
    telecom: Telecom[];
    code: Code[];
}

export interface Observation {
    resourceType: ResourceType;
    id: string;
    meta: Meta;
    status: string;
    category: Code[];
    code: Code;
    subject: Reference;
    interpretation: Interpretation[];
    note: Note[];
    extension: Extension[];
    valueCodeableConcept: Code;
}
