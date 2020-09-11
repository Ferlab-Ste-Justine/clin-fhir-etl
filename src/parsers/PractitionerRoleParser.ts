import { Parser } from "./Parser";
import { PractitionerRole, SheetPage } from "../Data";
import { Indices } from "../Constants";

export class PractitionerRoleParser extends Parser<PractitionerRole>{
    public get dependencies(): SheetPage[] {
        return [SheetPage.Practitioner, SheetPage.Organisation];
    }
    public get sheetType(): SheetPage {
        return SheetPage.PractitionerRole;
    }
    public parseRow(row: string[]): PractitionerRole {
        const id = row[Indices.PRACTITIONER_ROLE.ID];
        const practitioner = row[Indices.PRACTITIONER_ROLE.PRACTITIONER];
        const organization = row[Indices.PRACTITIONER_ROLE.ORGANIZATION];
        const codeCodingCode = row[Indices.PRACTITIONER_ROLE.CODE_CODING_CODE];
        const codeCodingDisplay = row[Indices.PRACTITIONER_ROLE.CODE_CODING_DISPLAY];
        const codeText = row[Indices.PRACTITIONER_ROLE.CODE_TEXT];
        const telecomPhoneRank_1 = row[Indices.PRACTITIONER_ROLE.TELECOM_PHONE_RANK_1];
        const telecomPhoneRank_2 = row[Indices.PRACTITIONER_ROLE.TELECOM_PHONE_RANK_2];
        const telecomEmail = row[Indices.PRACTITIONER_ROLE.TELECOM_EMAIL];
        
        return {
            resourceType: "PractitionerRole",
            id, 
            meta: {
                profile: [
                    "http://hl7.org/fhir/StructureDefinition/PractitionerRole"
                ]
            },
            active: true,
            practitioner: {
                reference: practitioner
            },
            organization: {
                reference: organization
            },
    
            telecom:[
                {
                    system: "phone",
                    value: telecomPhoneRank_1,
                    use: "work",
                    rank:1
                },
                {
                    system: "phone",
                    value: telecomPhoneRank_2,
                    use: "work",
                    rank:2
                },
                {
                    system: "email",
                    value: telecomEmail,
                    use: "work"
                }
            ],
            code: [
                {
                    coding: [
                        {
                            system: "http://www.hl7.org/FHIR/valueset-practitioner-role.html",
                            code: codeCodingCode,
                            display: codeCodingDisplay
                        }
                    ],
                    text: codeText
                }
            ]
        };
    }
    
}