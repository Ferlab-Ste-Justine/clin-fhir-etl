import { expect } from 'chai';
import { PatientParser } from '../../src/parsers';
import { Patient, Reference, ResourceType } from '../../src/data/Data';

describe("Patient Parser", () => {
    it("should parse a patient correctly", () => {
        const parser = new PatientParser();

        const id = "id";
        const ethnicityCode = "ethnicityCode";
        const ethnicityDisplay = "ethnicityDisplay";
        const familyId = "familyId";
        const isProband = "true";
        const bloodRelationshipCode = "Y";
        const identifierValueMR = "identifierValueMR";
        const identifierValueJHN = "identifierValueJHN";
        const active = "true";
        const nameUse = "nameUse";
        const familyName = "familyName";
        const givenName = "givenName";
        const birthdate = "birthdate";
        const gender = "gender";
        const generalPractitioner = "generalPractitioner";
        const managingOrganisation = "managingOrganisation";
        const data = [[id, ethnicityCode, ethnicityDisplay, familyId, isProband,
            bloodRelationshipCode, identifierValueMR, identifierValueJHN,
            active, nameUse, familyName, givenName, birthdate, gender, generalPractitioner, managingOrganisation]];

        const createRef = (resourceType: ResourceType, id: string): Reference => {
            return {
                reference: `${resourceType}/${id}`
            };
        };

        parser.parse(data);

        const expected: Patient = {
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
                    valueReference: { reference: `Group/${familyId}` }
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
                createRef("Practitioner", generalPractitioner)
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
            managingOrganization: createRef("Organization", managingOrganisation),
            name:[{
                family: familyName,
                given: [givenName],
                use: nameUse,
            }],
        };

        expect(parser.parsed[0]).to.eql(expected);
    });
});