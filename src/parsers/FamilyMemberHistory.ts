import {Parser} from "./Parser";
import {FamilyMemberHistory, SheetPage} from "../data/Data";
import {Indices} from "../data/Constants";


export class FamilyMemberHistoryParser extends Parser<FamilyMemberHistory> {
    public get dependencies(): SheetPage[] {
        return [SheetPage.Patient];
    }

    public get sheetType(): SheetPage {
        return SheetPage.FMH;
    }

    public parseRow(row: string[]): FamilyMemberHistory {
        const id = row[Indices.FMH.ID];
        const patient = row[Indices.FMH.PATIENT];
        const relationshipCode = row[Indices.FMH.RELATIONSHIP_CODE];
        const relationshipDisplay = row[Indices.FMH.RELATIONSHIP_DISPLAY];
        const note = row[Indices.FMH.NOTE];

        return {
            resourceType: "FamilyMemberHistory",
            id: id,
            meta: {
                profile: [
                    "http://fhir.cqgc.ferlab.bio/StructureDefinition/cqgc-fmh"
                ]
            },
            status: "completed",
            patient: Parser.createRef("Patient", patient),
            relationship: {
                coding: [
                    {
                        code: relationshipCode,
                        display: relationshipDisplay
                    }
                ]
            },
            note: [{"text": note}]
        };
    }
}