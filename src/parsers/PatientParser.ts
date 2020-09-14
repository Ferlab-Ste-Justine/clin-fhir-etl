import { Parser } from "./Parser";
import { Patient, SheetPage } from "../data/Data";
import { Indices } from '../data/Constants';

export class PatientParser extends Parser<Patient> {
    public get dependencies(): import("../data/Data").SheetPage[] {
        return [SheetPage.Practitioner, SheetPage.Organisation];
    }
    public get sheetType(): SheetPage {
        return SheetPage.Patient;
    }
    public parseRow(row: string[]): Patient {        
        const id = row[Indices.PATIENT.ID];
        const ethnicityCode = row[Indices.PATIENT.ETHNICITY_CODE];
        const ethnicityDisplay = row[Indices.PATIENT.ETHNICITY_DISPLAY];
        const familyId = row[Indices.PATIENT.FAMILY_ID];
        const isProband = row[Indices.PATIENT.IS_PROBAND];
        const bloodRelationshipCode = row[Indices.PATIENT.BLOOD_RELATIONSHIP_CODE];
        const identifierValueMR = row[Indices.PATIENT.IDENTIFIER_TYPE_VALUE_MR];
        const identifierValueJHN = row[Indices.PATIENT.IDENTIFIER_TYPE_VALUE_JHN];
        const active = row[Indices.PATIENT.ACTIVE];
        const nameUse = row[Indices.PATIENT.NAME_USE];
        const familyName = row[Indices.PATIENT.FAMILY_NAME];
        const givenName = row[Indices.PATIENT.GIVEN_NAME];
        const birthdate = row[Indices.PATIENT.BIRTHDATE];
        const gender = row[Indices.PATIENT.GENDER];
        const generalPractitioner = row[Indices.PATIENT.GENERAL_PRACTITIONER];
        const managingOrganisation = row[Indices.PATIENT.MANAGING_ORGANISATION];
		
        return {
            resourceType: "Patient",
            meta:{
                profile: ["http://fhir.cqgc.ferlab.bio/StructureDefinition/cqgc-patient"],
            },
            id: id,
            active: JSON.parse(active),
            birthDate: birthdate,
            extension:[
                {
                    url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/qc-ethnicity",
                    valueCoding:{
                        system: "http://fhir.cqgc.ferlab.bio/CodeSystem/qc-ethnicity",
                        code: ethnicityCode,
                        display: ethnicityDisplay
                    }
                },
                {
                    url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/family-id",
                    valueReference: {reference: `Group/${familyId}`}
                },
                {
                    url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/is-proband",
                    valueBoolean: JSON.parse(isProband)
                },
                {
                    url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/blood-relationship",
                    valueCoding:{
                        system: "http://fhir.cqgc.ferlab.bio/CodeSystem/blood-relationship",
                        code: bloodRelationshipCode,
                        display: bloodRelationshipCode === "Y" ? "Yes" : "No"
                    },
                }
            ],
            gender: gender,
            generalPractitioner: [
                Parser.createRef("Practitioner", generalPractitioner)
            ],
            identifier:[
                {
                    type:{
                        coding:[
                            {
                                code:"MR",
                                display: "Medical record number",
                                system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                            }
                        ],
                        text: "Numéro du dossier médical",
                    },
                    value: identifierValueMR,
                },
                {
                    type:{
                        coding:[
                            {
                                system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                                code: "JHN",
                                display: "Jurisdictional health number (Canada)"
                            }
                        ],
                        text: "Numéro du dossier médical",
                    },
                    value: identifierValueJHN,
                },
            ],
            managingOrganization: Parser.createRef("Organization", managingOrganisation),
            name:[{
                family: familyName,
                given: [givenName],
                use: nameUse,
            }],
        };
    }
}