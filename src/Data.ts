export enum SheetPage {
	Practitioner = 'Practitioner',
	Patient = "Patient",
	ClinicalImpression = "ClinicalImpression"
}

export type ResourceType = "Practitioner" | "Patient" | "ClinicalImpression";

export interface Meta {
	profile: string[];
}

export interface Coding {
	code: string;
	system: string;
	display: string;
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
	system: string;
	code: string;
	display: string;
}

export interface Reference {
	reference: string;
}

export type ParsedType = Practitioner | Patient | ClinicalImpression;

export interface ParsedData {
	page: SheetPage;
	data: ParsedType[];
	dependencies: SheetPage[];
}

export interface ClinicalImpression {
    resourceType:  ResourceType;
    id:            string;
    meta:          Meta;
    extension:     Extension[];
    status:        string;
    subject:       Assessor;
    date:          Date;
    assessor:      Assessor;
    investigation: Investigation[];
}

export interface Assessor {
    reference: string;
}

export interface ValueAge {
    value:  number;
    unit:   string;
    system: string;
    code:   string;
}

export interface Investigation {
    code: Code;
    item: Assessor[];
}

export interface Code {
    text: string;
}