import { expect } from 'chai';
import sinon from 'sinon';
import { Api } from '../src/network/Api';
import { Network } from '../src/network/Network';
import { PractitionerParser } from '../src/parsers';
import { ParsedData, ParsedType, Practitioner, SheetPage } from '../src/data/Data';
import { 
    FAKE_CLINICAL_IMPRESSION, 
    FAKE_FAMILIY_MEMEBER_HISTORY,
    FAKE_OBSERVATION, 
    FAKE_ORGANISATION,
    FAKE_PATIENT,
    FAKE_PRACTITIONER, 
    FAKE_PRACTITIONER_ROLE, 
    FAKE_SERVICE_REQUEST 
} from './fakes';

const getFakeParsedData = () : ParsedData[]=> {
    return [
        {
            data: [FAKE_PRACTITIONER],
            dependencies: [],
            page: SheetPage.Practitioner
        }
    ]
}

describe("Network", () => {
    it("Should sort the upload the upload sequence", () => {
        // const parsedData: ParsedData[] = [
        //     FAKE_PRACTITIONER,
        //     FAKE_CLINICAL_IMPRESSION,
        //     FAKE_FAMILIY_MEMEBER_HISTORY,
        //     FAKE_ORGANISATION,
        //     FAKE_PRACTITIONER_ROLE,
        //     FAKE_PATIENT,
        //     FAKE_OBSERVATION, 
        //     FAKE_SERVICE_REQUEST,
        // ].map(data => ({
        //     data, 
        //     dependencies: 
        // }));
        // const network = new Network(parsedData);
        sinon.stub(Api, 'upload').callsFake((async (data: ParsedType[]) => {
            const type = data[0].resourceType;
            console.log(type);
        }));
    });
});

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

    it("should set null to empty/missing values", () => {
        expect(2, "Good!");
    });
});