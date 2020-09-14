import {Parser} from "./Parser";
import {ServiceRequest, SheetPage} from "../data/Data";
import {Indices} from "../data/Constants";

export class ServiceRequestParser extends Parser<ServiceRequest> {
    public get dependencies(): SheetPage[] {
        return [SheetPage.Practitioner, SheetPage.Patient, SheetPage.ClinicalImpression];
    }

    public get sheetType(): SheetPage {
        return SheetPage.ServiceRequest;
    }

    parseRow(row: string[]): ServiceRequest {
        const id = row[Indices.SERVICE_REQUEST.ID];
        const subject = row[Indices.SERVICE_REQUEST.SUBJECT];
        const clinicalImpressionId = row[Indices.SERVICE_REQUEST.EXTENSION_VALUE_REFERENCE];
        const status = row[Indices.SERVICE_REQUEST.STATUS];
        const intent = row[Indices.SERVICE_REQUEST.INTENT];
        const authoredOn = row[Indices.SERVICE_REQUEST.AUTHORED_ON];
        const codingCode = row[Indices.SERVICE_REQUEST.CODE_CODING_CODE];
        const codingDisplay = row[Indices.SERVICE_REQUEST.CODE_CODING_DISPLAY];
        const requester = row[Indices.SERVICE_REQUEST.REQUESTER];

        return {
            resourceType: "ServiceRequest",
            id: id,
            meta: {
                profile: [
                    "http://fhir.cqgc.ferlab.bio/StructureDefinition/cqgc-service-request"
                ]
            },
            extension: [
                {
                    url: "http://fhir.cqgc.ferlab.bio/StructureDefinition/ref-clin-impression",
                    valueReference: Parser.createRef("ClinicalImpression", clinicalImpressionId)
                }
            ],
            status: status,
            intent: intent,
            authoredOn: authoredOn,
            category: [
                {
                    text: "MedicalRequest"
                }
            ],
            priority: "routine",
            code: {
                coding:[{
                    code: codingCode,
                    display: codingDisplay
                }]
            },
            requester: Parser.createRef("Practitioner", requester),
            subject: Parser.createRef("Patient", subject)
        };
    }
}