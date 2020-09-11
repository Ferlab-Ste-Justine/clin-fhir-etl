import { Parser } from "./Parser";
import { Organization, SheetPage } from "../Data";
import { Indices } from "../Constants";


export class OrganizationParser extends Parser<Organization>{
    public get dependencies(): SheetPage[] {
        return [];
    }
    public get sheetType(): SheetPage {
        return SheetPage.Organisation;
    }
    public parseRow(row: string[]): Organization {
        const id = row[Indices.ORGANIZATION.ID];
        const typeCode = row[Indices.ORGANIZATION.TYPE_CODE];
        const typeDisplay = row[Indices.ORGANIZATION.TYPE_DISPLAY];
        const name = row[Indices.ORGANIZATION.NAME];
        const alias = row[Indices.ORGANIZATION.ALIAS];

        return {
            resourceType: "Organization",
            id: id,
            meta: {
                profile: [
                    "http://hl7.org/fhir/StructureDefinition/Organization"
                ]
            },
            type:{
                code: typeCode,
                display: typeDisplay
            },
            name: name,
            alias:[alias]
        };
    }

}