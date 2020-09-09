export enum SheetPage {
	Practitioner = 'Practitioner',
}

export const Indices = {
	PRACTITIONER: {
		ID: 0,
		LICENSE_NUMBER: 1,
		MD_USE: 2,
		FAMILY_NAME: 3,
		GIVEN_NAME: 4,
		PREFIX: 5,
		SUFFIX: 6,
	},
}

export interface Meta{
	profile: string[];
}

export interface FhirData{
	meta: Meta;	
}

export interface Coding {
	code: string;
	system: string;
	display: string;
}

export interface PractitionerType {
	coding: Coding[];
	text?: string;
}

export interface Identifier {
	use: string;
	type: PractitionerType;
	value: string;
}

export interface Name {
	use: string;
	family: string;
	given: string[];
	prefix: string[];
	suffix: string[];
}
export interface Practitioner {
	resourceType: string;
	id: string;
	meta: Meta;
	identifier: Identifier[];
	name: Name[];
}


export type ParsedType = Practitioner;

export interface ParsedData {
	page: SheetPage;
	data: ParsedType[];
	dependeciess: SheetPage[];
}