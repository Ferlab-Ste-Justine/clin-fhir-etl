import { Parser } from "./Parser";
import { Observation, SheetPage } from "../data/Data";
import { Indices } from "../data/Constants";


export class ObservationParser extends Parser<Observation> {
    public get dependencies(): SheetPage[] {
        return [SheetPage.Practitioner, SheetPage.Patient]; 
    }
    public get sheetType(): SheetPage {
        return SheetPage.Observation;
    }
    public parseRow(row: string[]): Observation {
        const id = row[Indices.OBSERVATION.ID];
        const codeCodingCode = row[Indices.OBSERVATION.CODE_CODING_CODE];
        const subject = row[Indices.OBSERVATION.SUBJECT];
        const extensionHpoCategoryCode = row[Indices.OBSERVATION.EXTENSION_HPO_CATEGORY_CODE];
        const extensionHpoCategoryDisplay = row[Indices.OBSERVATION.EXTENSION_HPO_CATEGORY_DISPLAY];
        const valueCodeableConceptCode = row[Indices.OBSERVATION.VALUE_CODEABLE_CONCEPT_CODE];
        const valueCodeableConceptDisplay = row[Indices.OBSERVATION.VALUE_CODEABLE_CONCEPT_DISPLAY];
        const interpretationCodingCode = row[Indices.OBSERVATION.INTERPRETATION_CODING_CODE];
        const interpretationCodingDisplay = row[Indices.OBSERVATION.INTERPRETATION_CODING_DISPLAY];
        const interpretation_text = row[Indices.OBSERVATION.INTERPRETATION_TEXT];
        const extensionAgeAtOnSetCode = row[Indices.OBSERVATION.EXTENSION_AGE_AT_ON_SET_CODE];
        const extensionAgeAtOnSetDisplay = row[Indices.OBSERVATION.EXTENSION_AGE_AT_ON_SET_DISPLAY];
        const note = row[Indices.OBSERVATION.NOTE];
        const status = row[Indices.OBSERVATION.STATUS];

        return {
            resourceType: "Observation",
            id: id,
            meta: {
                profile: [
                    "http://fhir.cqgc.ferlab.bio/StructureDefinition/cqgc-observation"
                ]
            },
            status: status,
            category: [
                {
                    coding: [
                        {
                            system: "http://terminology.hl7.org/CodeSystem/observation-category",
                            code: "laboratory",
                            display: "Laboratory"
                        }
                    ]
                }
            ],
            code: {
                coding: [
                    {
                        system: "http://fhir.cqgc.ferlab.bio/CodeSystem/observation-code",
                        code: codeCodingCode,
                        display: "cgh"
                    }
                ]
            },
            subject: Parser.createRef("Patient", subject),
            interpretation: [
                {
                    coding: [
                        {
                            code: interpretationCodingCode,
                            display: interpretationCodingDisplay,
                        }
                    ],
                    text: interpretation_text,
                },
            ],
            note: [
                {
                    text: note
                }
            ],
        
            extension: [
                {
                    url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/age-at-onset",
                    valueCoding: {
                        code: extensionAgeAtOnSetCode,
                        display: extensionAgeAtOnSetDisplay
                    }
                },
                {
                    url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/hpo-category",
                    valueCoding: {
                        code: extensionHpoCategoryCode,
                        display: extensionHpoCategoryDisplay
                    }
                }
            ],
            valueCodeableConcept: {
                coding: [
                    {
                        system: "http://purl.obolibrary.org/obo/hp.owl",
                        code: valueCodeableConceptCode,
                        display: valueCodeableConceptDisplay
                    }
                ]
            },
        };
    }
    
}