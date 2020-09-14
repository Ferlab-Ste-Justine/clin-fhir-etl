import { expect } from 'chai';
import { PractitionerParser } from '../../src/parsers';
import { Practitioner } from '../../src/data/Data';

describe("Practitioner Parser", () => {
    it("should parse a practitioner correctly", () => {
        const parser = new PractitionerParser();
        const data = [['ID', 'MD', 'USE', 'FAMILY', 'GIVEN', 'PREFIX', 'SUFFIX']];
        parser.parse(data);

        const expected: Practitioner = {
            resourceType: 'Practitioner',
            id: 'ID',
            identifier: [{
                type: {
                    coding: [
                        {
                            code: 'MD',
                            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                            display: 'Medical License number',
                        },
                    ],
                    text: 'Numéro de License Médicale du Québec',
                },
                use: 'USE',
                value: "MD",
            }],
            meta: {
                profile: [
                    'http://hl7.org/fhir/StructureDefinition/Practitioner',
                ],
            },
            name: [{
                use: "USE",
                family: "FAMILY",
                given: [
                    "GIVEN",
                ],
                prefix: ["PREFIX"],
                suffix: ["SUFFIX"],
            }],
        };

        expect(parser.parsed[0]).to.eql(expected);
    });
});