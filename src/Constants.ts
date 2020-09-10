export const GOOGLE_SHEET_ID = '1-4yrkDpXco5-PlFoPAd_wrufa4WZShEtosfspgy-jvU';
export const GOOGLE_SPREADSHEETS_RAW_DATA_KEY = '_rawData';

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
	PATIENT: {
		ID: 0,
		ETHNICITY_CODE: 1,
		ETHNICITY_DISPLAY: 2,
		FAMILY_ID: 3,
		IS_PROBAND: 4,
		BLOOD_RELATIONSHIP_CODE: 5,
		IDENTIFIER_TYPE_VALUE_MR: 6,
		IDENTIFIER_TYPE_VALUE_JHN: 7,
		ACTIVE: 8,
		NAME_USE: 9,
		FAMILY_NAME: 10,
		GIVEN_NAME: 11,
		BIRTHDATE: 12,
		GENDER: 13,
		GENERAL_PRACTITIONER: 14,
		MANAGING_ORGANISATION: 15,
	},
	CLINICAL_IMPRESSION: {
		ID: 0,
		SUBJECT: 1,
		STATUS: 2,
		DATE: 3,
		ASSESSOR: 4,
		INVESTIGATION_ITEM_REFERENCE_CGH: 5,
		INVESTIGATION_ITEM_REFERENCE_INDIC: 6,
		INVESTIGATION_ITEM_REFERENCE_INVES: 7,
		INVESTIGATION_ITEM_REFERENCE_PHENO_A: 8,
		INVESTIGATION_ITEM_REFERENCE_PHENO_B: 9,
		INVESTIGATION_ITEM_REFERENCE_PHENO_C: 10,
		INVESTIGATION_ITEM_REFERENCE_PHENO_D: 11,
		INVESTIGATION_ITEM_REFERENCE_FMH: 12,
		VALUE_AGE: 13,
	},
	FMH: {
		ID: 0,
		PATIENT: 1,
		RELATIONSHIP_CODE: 2,
		RELATIONSHIP_DISPLAY: 3,
		NOTE: 4,
	},
	SERVICE_REQUEST: {
		ID: 0,
		SUBJECT: 1,
		EXTENSION_VALUE_REFERENCE: 2,
		STATUS: 3,
		INTENT: 4,
		AUTHORED_ON: 5,
		CODE_TEXT: 6,
		REQUESTER: 7,
	}
};
