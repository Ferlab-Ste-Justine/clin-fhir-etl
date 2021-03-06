// ENV
export const FHIR_SERVER_HOST = process.env.FHIR_SERVER_HOST;
export const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
export const FHIR_AUTH_URL = process.env.FHIR_AUTH_URL;
export const FHIR_AUTH_CLIN_REALM = process.env.FHIR_AUTH_CLIN_REALM;
export const FHIR_AUTH_CLIENT_ID = process.env.FHIR_AUTH_CLIENT_ID;
export const FHIR_AUTH_CLIENT_SECRET = process.env.FHIR_AUTH_CLIENT_SECRET;
export const AUTH_REQUIRED = process.env.AUTH_REQUIRED === 'true' ? true : false;
export const ELASTIC_SEARCH_HOST = process.env.ELASTIC_SEARCH_HOST;
export const ELASTIC_SEARCH_AUTH = process.env.ELASTIC_SEARCH_AUTH;

export const MAX_AUTH_RETRY_COUNT = 3;
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
    OBSERVATION: {
        ID: 0,
        CODE_CODING_CODE: 1,
        SUBJECT: 2,
        EXTENSION_HPO_CATEGORY_CODE: 3,
        EXTENSION_HPO_CATEGORY_DISPLAY: 4,
        VALUE_CODEABLE_CONCEPT_CODE: 5,
        VALUE_CODEABLE_CONCEPT_DISPLAY: 6,
        INTERPRETATION_CODING_CODE: 7,
        INTERPRETATION_CODING_DISPLAY: 8,
        INTERPRETATION_TEXT: 9,
        EXTENSION_AGE_AT_ON_SET_CODE: 10,
        EXTENSION_AGE_AT_ON_SET_DISPLAY: 11,
        NOTE: 12,
        STATUS: 13
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
        CODE_CODING_CODE: 6,
        CODE_CODING_DISPLAY: 7,
        REQUESTER: 8,
    },
    ORGANIZATION: {
        ID: 0,
        TYPE_CODE: 1,
        TYPE_DISPLAY: 2,
        NAME: 3,
        ALIAS: 4,
    },
    PRACTITIONER_ROLE:{
        ID: 0,
        PRACTITIONER: 1,
        ORGANIZATION: 2,
        CODE_CODING_CODE: 3,
        CODE_CODING_DISPLAY: 4,
        CODE_TEXT: 5,
        TELECOM_PHONE_RANK_1: 6,
        TELECOM_PHONE_RANK_2: 7,
        TELECOM_EMAIL: 8,
    }
};
