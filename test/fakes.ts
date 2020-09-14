import faker from 'faker';
import { 
    ClinicalImpression, 
    FamilyMemberHistory, 
    Observation, 
    Organization, 
    Patient, 
    Practitioner, 
    PractitionerRole
} from '../src/data/Data';

export const FAKE_PRACTITIONER: Practitioner = {
    resourceType: "Practitioner",
    id: "PR00101",
    identifier: [
        {
            type: {
                coding: [
                    {
                        code: "MD",
                        system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                        display: "Medical License number",
                    },
                ],
                text: "Numéro de License Médicale du Québec",
            },
            use: "official",
            value: faker.random.number().toString(),
        },
    ],
    meta: {
        profile: [
            "http://hl7.org/fhir/StructureDefinition/Practitioner",
        ],
    },
    name: [
        {
            use: "official",
            family: faker.name.lastName(),
            given: [
                faker.name.firstName(),
            ],
            prefix: [
                "Dr.",
            ],
            suffix: [
                "null",
            ],
        },
    ],
};

export const FAKE_ORGANISATION: Organization = {
    resourceType: "Organization",
    id: "OR00201",
    meta: {
        profile: [
            "http://hl7.org/fhir/StructureDefinition/Organization",
        ],
    },
    type: {
        code: "prov",
        display: "Healthcare Provider",
    },
    name: faker.company.companyName(),
    alias: [
        faker.company.companySuffix(),
    ],
};

export const FAKE_PATIENT: Patient = {
    resourceType: "Patient",
    meta: {
        profile: [
            "http://fhir.cqgc.ferlab.bio/StructureDefinition/cqgc-patient",
        ],
    },
    id: "PA0001",
    active: true,
    birthDate: faker.date.past().toString(),
    extension: [
        {
            url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/qc-ethnicity",
            valueCoding: {
                system: "http://fhir.cqgc.ferlab.bio/CodeSystem/qc-ethnicity",
                code: "EU",
                display: "European Caucasia",
            },
        },
        {
            url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/family-id",
            valueReference: {
                reference: "Group/FA0001",
            },
        },
        {
            url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/is-proband",
            valueBoolean: true,
        },
        {
            url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/blood-relationship",
            valueCoding: {
                system: "http://fhir.cqgc.ferlab.bio/CodeSystem/blood-relationship",
                code: "Y",
                display: "Yes",
            },
        },
    ],
    gender: "male",
    generalPractitioner: [
        {
            reference: "Practitioner/PR00101",
        },
    ],
    identifier: [
        {
            type: {
                coding: [
                    {
                        code: "MR",
                        display: "Medical record number",
                        system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                    },
                ],
                text: "Numéro du dossier médical",
            },
            value: faker.random.number().toString(),
        },
        {
            type: {
                coding: [
                    {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                        code: "JHN",
                        display: "Jurisdictional health number (Canada)",
                    },
                ],
                text: "Numéro du dossier médical",
            },
            value: `ABCD ${faker.random.number({
                min: 1000,
                max: 4000
            })} ${faker.random.number({
                min: 1000,
                max: 4000
            })}`,
        },
    ],
    managingOrganization: {
        reference: "Organization/OR00201",
    },
    name: [
        {
            family: faker.name.lastName(),
            given: [
                faker.name.firstName(),
            ],
            use: "official",
        },
    ],
};

export const FAKE_OBSERVATION: Observation = {
    resourceType: "Observation",
    id: "OB0001",
    meta: {
        profile: [
            "http://fhir.cqgc.ferlab.bio/StructureDefinition/cqgc-observation",
        ],
    },
    status: "final",
    category: [
        {
            coding: [
                {
                    system: "http://terminology.hl7.org/CodeSystem/observation-category",
                    code: "laboratory",
                    display: "Laboratory",
                },
            ],
        },
    ],
    code: {
        coding: [
            {
                system: "http://fhir.cqgc.ferlab.bio/CodeSystem/observation-code",
                code: "PHENO",
                display: "cgh",
            },
        ],
    },
    subject: {
        reference: "Patient/PA0001",
    },
    interpretation: [
        {
            coding: [
                {
                    code: "NEG",
                    display: "Negative",
                },
            ],
            text: "Non observé",
        },
    ],
    note: [
        {
            text: "--",
        },
    ],
    extension: [
        {
            url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/age-at-onset",
            valueCoding: {
                code: "",
                display: "",
            },
        },
        {
            url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/hpo-category",
            valueCoding: {
                code: "HP:0001626",
                display: "Abnormality of the cardiovascular system",
            },
        },
    ],
    valueCodeableConcept: {
        coding: [
            {
                system: "http://purl.obolibrary.org/obo/hp.owl",
                code: "HP:0005117",
                display: "Elevated diastolic blood pressure",
            },
        ],
    },
};

export const FAKE_CLINICAL_IMPRESSION: ClinicalImpression = {
    resourceType: "ClinicalImpression",
    id: "CI0001",
    meta: {
        profile: [
            "http://fhir.cqdg.ferlab.bio/StructureDefinition/cqdg-clinical-impression",
        ],
    },
    extension: [
        {
            url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/age-at-event",
            valueAge: {
                value: faker.random.number({
                    min: 10000
                }),
                unit: "days",
                system: "http://unitsofmeasure.org",
                code: "d",
            },
        },
    ],
    status: "in-progress",
    subject: {
        reference: "Patient/PA0001",
    },
    date: faker.date.recent().toString(),
    assessor: {
        reference: "Practitioner/PR00101",
    },
    investigation: [
        {
            code: {
                text: "initial-examination",
            },
            item: [
                {
                    reference: "Observation/OB0001",
                },
                {
                    reference: "FamilyMemberHistory/FMH0001"
                }
            ],
        },
    ],
};

export const FAKE_FAMILIY_MEMEBER_HISTORY: FamilyMemberHistory = {
    resourceType: "FamilyMemberHistory",
    id: "FMH0001",
    meta: {
        profile: [
            "http://fhir.cqgc.ferlab.bio/StructureDefinition/cqgc-fmh",
        ],
    },
    status: "completed",
    patient: {
        reference: "Patient/PA0001",
    },
    relationship: {
        coding: [
            {
                code: "FTH",
                display: "Father",
            },
        ],
    },
    note: [
        {
            text: "Anomalies cardiaques",
        },
    ],
}; 

export const FAKE_SERVICE_REQUEST = {
    resourceType: "ServiceRequest",
    id: "SR00001",
    meta: {
        profile: [
            "http://fhir.cqgc.ferlab.bio/StructureDefinition/cqgc-service-request",
        ],
    },
    extension: [
        {
            url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/ref-clin-impression",
            valueReference: {
                reference: "ClinicalImpression/CI0001",
            },
        },
    ],
    status: "draft",
    intent: "order",
    authoredOn: {
    },
    category: [
        {
            text: "MedicalRequest",
        },
    ],
    priority: "routine",
    code: {
        coding: [
            {
                code: "WXS",
                display: "Whole Exome Sequencing",
            },
        ],
    },
    requester: {
        reference: "Practitioner/PR00101",
    },
    subject: {
        reference: "Patient/PA0001",
    },
};

export const FAKE_PRACTITIONER_ROLE: PractitionerRole = {
    resourceType: "PractitionerRole",
    id: "PRR00101",
    meta: {
        profile: [
            "http://hl7.org/fhir/StructureDefinition/PractitionerRole",
        ],
    },
    active: true,
    practitioner: {
        reference: "Practitioner/PR00101",
    },
    organization: {
        reference: "Organization/OR00201",
    },
    telecom: [
        {
            system: "phone",
            value: faker.phone.phoneNumber(),
            use: "work",
            rank: 1,
        },
        {
            system: "phone",
            value: faker.random.number({min: 1000, max: 5000}).toString(),
            use: "work",
            rank: faker.random.number(5),
        },
        {
            system: "email",
            value: faker.internet.email(),
            use: "work",
        },
    ],
    code: [
        {
            coding: [
                {
                    system: "http://www.hl7.org/FHIR/valueset-practitioner-role.html",
                    code: "doctor",
                    display: "Doctor",
                },
            ],
            text: "Médecin prescripteur",
        },
    ],
};