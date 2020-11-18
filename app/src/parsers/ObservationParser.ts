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
        const interpretationText = row[Indices.OBSERVATION.INTERPRETATION_TEXT];
        const extensionAgeAtOnSetCode = row[Indices.OBSERVATION.EXTENSION_AGE_AT_ON_SET_CODE];
        const extensionAgeAtOnSetDisplay = row[Indices.OBSERVATION.EXTENSION_AGE_AT_ON_SET_DISPLAY];
        const note = row[Indices.OBSERVATION.NOTE];
        const status = row[Indices.OBSERVATION.STATUS];

        const isAgeOnSetExtensionEnabled = extensionAgeAtOnSetCode.length > 0 && extensionAgeAtOnSetDisplay.length > 0;
        const isHpoCategoryExtensionEnabled = 
        extensionHpoCategoryCode.length > 0 
        && extensionHpoCategoryDisplay.length > 0;
        const isInterpretationEnabled = interpretationCodingCode.length > 0 || interpretationCodingDisplay.length > 0
            || interpretationText.length > 0;
        const isValueEnabled = valueCodeableConceptCode.length > 0 && valueCodeableConceptDisplay.length > 0;

        const observation: Observation = {
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
            interpretation: [],
            note: [],

            extension: [],
        };

        if (isAgeOnSetExtensionEnabled) {
            observation.extension.push(
                {
                    url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/age-at-onset",
                    valueCoding: {
                        code: extensionAgeAtOnSetCode,
                        display: extensionAgeAtOnSetDisplay
                    }
                },
            );
        }
        if (isHpoCategoryExtensionEnabled) {
            observation.extension.push(
                {
                    url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/hpo-category",
                    valueCoding: {
                        code: extensionHpoCategoryCode,
                        display: extensionHpoCategoryDisplay
                    }
                },
            );
        }

        if (isInterpretationEnabled) {
            observation.interpretation.push(
                {
                    coding: [
                        {
                            code: interpretationCodingCode,
                            display: interpretationCodingDisplay,
                        }
                    ],
                    text: interpretationText,
                },);
        }

        if (isValueEnabled) {
            observation.valueCodeableConcept = {
                coding: [
                    {
                        system: "http://purl.obolibrary.org/obo/hp.owl",
                        code: valueCodeableConceptCode,
                        display: valueCodeableConceptDisplay
                    }
                ]
            };
        }

        if (note.length > 0) {
            observation.note.push({
                text: note
            });
        }

        return observation;
    }

}