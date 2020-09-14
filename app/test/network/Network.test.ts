/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from 'chai';
import sinon from 'sinon';
import { Api } from '../../src/network/Api';
import { AppLogger, Logger } from '../../src/log/Logger';
import { Network } from '../../src/network/Network';
import { ParsedData, ParsedType, ResourceType, SheetPage } from '../../src/data/Data';
import { 
    FAKE_CLINICAL_IMPRESSION, 
    FAKE_FAMILIY_MEMEBER_HISTORY,
    FAKE_OBSERVATION, 
    FAKE_ORGANISATION,
    FAKE_PATIENT,
    FAKE_PRACTITIONER, 
    FAKE_PRACTITIONER_ROLE, 
    FAKE_SERVICE_REQUEST 
} from '../fakes';

const getFakeParsedData = () : ParsedData[]=> {
    return [
        {
            data: [FAKE_PRACTITIONER],
            dependencies: [],
            page: SheetPage.Practitioner
        },
        {
            data: [FAKE_PATIENT],
            dependencies: [SheetPage.Practitioner, SheetPage.Organisation],
            page: SheetPage.Patient
        },
        {
            data: [FAKE_CLINICAL_IMPRESSION],
            dependencies: [SheetPage.Practitioner, SheetPage.Patient, SheetPage.Observation, SheetPage.FMH],
            page: SheetPage.ClinicalImpression
        },
        {
            data: [FAKE_FAMILIY_MEMEBER_HISTORY],
            dependencies: [SheetPage.Patient],
            page: SheetPage.FMH
        },
        {
            data: [FAKE_PRACTITIONER_ROLE],
            dependencies: [SheetPage.Practitioner, SheetPage.Organisation],
            page: SheetPage.PractitionerRole
        },
        {
            data: [FAKE_ORGANISATION],
            dependencies: [],
            page: SheetPage.Organisation
        },
        {
            data: [FAKE_OBSERVATION],
            dependencies: [SheetPage.Practitioner, SheetPage.Patient],
            page: SheetPage.Observation
        },
        {
            data: [FAKE_SERVICE_REQUEST],
            dependencies: [SheetPage.Practitioner, SheetPage.Patient, SheetPage.ClinicalImpression],
            page: SheetPage.ServiceRequest
        },
    ];
};

class MockLoggger implements Logger {
    info(_message: string): void {return;}
    warn(_message: string): void {return;}
    error(_message: string): void {return;}
}

describe("Network", () => {
    const logger = new MockLoggger();
    sinon.stub(AppLogger, 'of').callsFake((_namespace: string): Logger => logger);

    it("Should sort the upload the upload sequence", async () => {
        const parsedData = getFakeParsedData();
        const network = new Network(parsedData);
        const result : ResourceType[] = [];
        sinon.stub(Api, 'upload').callsFake((async (data: ParsedType[]) => {
            const type = data[0].resourceType;
            result.push(type);
        }));

        await network.upload();
        expect(result).to.eql([
            "Practitioner",
            "Organization",
            "Patient",
            "Observation",
            "FamilyMemberHistory",
            "ClinicalImpression",
            "PractitionerRole",
            "ServiceRequest"
        ]);
    });
});