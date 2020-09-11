import {Parser} from "./Parser";
import {ServiceRequest, SheetPage} from "../Data";
import {Indices} from "../Constants";

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
        const codeText = row[Indices.SERVICE_REQUEST.CODE_TEXT];
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
                    valueReference: {"reference": clinicalImpressionId}
                }
            ],
            status: status,
            intent: intent,
            authoredOn: new Date(authoredOn),
            category: [
                {
                    text: "MedicalRequest"
                }
            ],
            priority: "routine",
            code: {
                text: codeText
            },
            requester: {
                reference: requester
            },
            subject: {
                reference: subject
            }
        };
    }
}