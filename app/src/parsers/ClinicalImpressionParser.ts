import { Parser } from "./Parser";
import { ClinicalImpression, Reference, SheetPage } from "../data/Data";
import { Indices } from "../data/Constants";


export class ClinicalImpressionParser extends Parser<ClinicalImpression> {
    public get dependencies(): SheetPage[] {
        return [SheetPage.Practitioner, SheetPage.Patient, SheetPage.Observation, SheetPage.FMH];
    }
    
    public get sheetType(): SheetPage {
        return SheetPage.ClinicalImpression;
    }

    private static mergeInvestigations(observationInvestigations: string[], fmhInvestigation: string) : Reference[] {
        const observations = observationInvestigations.map(ob => Parser.createRef('Observation', ob));
        if(fmhInvestigation == null || fmhInvestigation === 'null' || fmhInvestigation.length === 0) {
            return observations;
        }

        return [
            ...observations, 
            Parser.createRef('FamilyMemberHistory', fmhInvestigation)
        ];
    }
    
    public parseRow(row: string[]): ClinicalImpression {
        const id = row[Indices.CLINICAL_IMPRESSION.ID];
        const subject = row[Indices.CLINICAL_IMPRESSION.SUBJECT];
        const status = row[Indices.CLINICAL_IMPRESSION.STATUS];
        const date = row[Indices.CLINICAL_IMPRESSION.DATE];
        const assessor = row[Indices.CLINICAL_IMPRESSION.ASSESSOR];
        const investigationItemReferenceCGH = row[Indices.CLINICAL_IMPRESSION.INVESTIGATION_ITEM_REFERENCE_CGH];
        const investigationItemReferenceINDIC = row[Indices.CLINICAL_IMPRESSION.INVESTIGATION_ITEM_REFERENCE_INDIC];
        const investigationItemReferenceINVES = row[Indices.CLINICAL_IMPRESSION.INVESTIGATION_ITEM_REFERENCE_INVES];
        const investigationItemReferencePHENO_A = row[Indices.CLINICAL_IMPRESSION.INVESTIGATION_ITEM_REFERENCE_PHENO_A];
        const investigationItemReferencePHENO_B = row[Indices.CLINICAL_IMPRESSION.INVESTIGATION_ITEM_REFERENCE_PHENO_B];
        const investigationItemReferencePHENO_C = row[Indices.CLINICAL_IMPRESSION.INVESTIGATION_ITEM_REFERENCE_PHENO_C];
        const investigationItemReferencePHENO_D = row[Indices.CLINICAL_IMPRESSION.INVESTIGATION_ITEM_REFERENCE_PHENO_D];
        const investigationItemReferenceFMH = row[Indices.CLINICAL_IMPRESSION.INVESTIGATION_ITEM_REFERENCE_FMH];
        const valueAge = row[Indices.CLINICAL_IMPRESSION.VALUE_AGE];
        
        
        return {
            resourceType: "ClinicalImpression",
            id,
            meta:{
                profile:[
                    "http://fhir.cqdg.ferlab.bio/StructureDefinition/cqdg-clinical-impression"
                ]
            },
            extension: [
                {
                    url:"http://fhir.cqgc.ferlab.bio/StructureDefinition/age-at-event",
                    valueAge: {
                        value: parseInt(valueAge),
                        unit: "days",
                        system: "http://unitsofmeasure.org",
                        code: "d",
                    }
                }
            ],
            status: status,
            subject: Parser.createRef("Patient", subject),
            date: date,
            assessor: Parser.createRef("Practitioner", assessor),
            investigation: [
                {
                    code: {
                        text: "initial-examination"
                    },
                    item: ClinicalImpressionParser.mergeInvestigations(
                        [
                            investigationItemReferenceCGH,
                            investigationItemReferenceINDIC,
                            investigationItemReferenceINVES,
                            investigationItemReferencePHENO_A,
                            investigationItemReferencePHENO_B,
                            investigationItemReferencePHENO_C,
                            investigationItemReferencePHENO_D,
                        ]
                            .filter(investigation => investigation != null && investigation != 'null'),
                        investigationItemReferenceFMH 
                    )
                }
            ]
        };
    }
}