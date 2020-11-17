import { Organization, ParsedData, Patient, Practitioner, ServiceRequest, SheetPage } from "../data/Data";

import { keyBy, get } from "lodash";
import { Client } from "@elastic/elasticsearch";
import { ELASTIC_SEARCH_AUTH, ELASTIC_SEARCH_HOST } from "../data/Constants";
import { BLOOD_RELATIONSHIP_EXTENSION, ETHNICITY_EXTENSTION, FAMILY_ID_EXTENSION } from "../utils/Extensions";

export class ElasticSearch {
    private static readonly client: Client = new Client({
        node: ELASTIC_SEARCH_HOST,
        headers: {
            Authorization: `Basic ${ELASTIC_SEARCH_AUTH}`
        }
    });

    /**
     * Extract the information of each patient (and its ServiceRquest, Practitioner, etc.) 
     * and saves it in ES. 
     * The structure used to store the data is follows index's mappings (in ES).
     * @param parsedData Contains the data extracted from Google Sheet.
     */
    public static upload(parsedData: ParsedData[]): void {
        const data = keyBy(parsedData, "page");
        const output = data[SheetPage.Patient].data.map(resource => {
            const patient = resource as Patient;

            const organizationId = patient.managingOrganization.reference.split("/")[1];
            const practitionerId = patient.generalPractitioner[0].reference.split("/")[1];

            const organization = data[SheetPage.Organisation].data
                .find(organization => organization.id === organizationId) as Organization;
            const practitioner = data[SheetPage.Practitioner].data
                .find(practitioner => practitioner.id === practitionerId) as Practitioner;
            const serviceRequest = (data[SheetPage.ServiceRequest].data as ServiceRequest[]).find(
                serviceRequest => serviceRequest.subject.reference.split("/")[1] === patient.id
            );


            const ethnicity = patient.extension.find(extension => extension.url === ETHNICITY_EXTENSTION);
            const bloodRelationship = patient.extension.find(extension =>
                extension.url === BLOOD_RELATIONSHIP_EXTENSION
            );
            const familyId = patient.extension.find(extension =>
                extension.url === FAMILY_ID_EXTENSION
            );

            return {
                id: patient.id,
                status: patient.active ? "active" : "inactive",
                organization: organization != null ? {
                    id: organization.id,
                    name: organization.name || ""
                } : {
                    id: "",
                    name: ""
                },
                lastName: patient.name[0].family,
                firstName: patient.name[0].given[0],
                gender: patient.gender,
                birthDate: patient.birthDate,
                practitioner: {
                    id: practitioner.id,
                    lastName: practitioner.name[0].family,
                    firstName: practitioner.name[0].given[0]
                },
                test: serviceRequest.code.coding[0].code,
                prescription: serviceRequest.authoredOn,
                mrn: patient.identifier[0].value,
                ramq: get(patient, 'identifier[1].value', 'N/A'),
                position: "",
                familyId: familyId.valueReference.reference || "",
                familyType: "trio",
                ethnicity: get(ethnicity, 'valueCoding.code', ''),
                bloodRelationship: get(bloodRelationship, "valueCoding.display", ""),
                request: serviceRequest.id,
            };
        });

        output.forEach(o => {
            try {
                this.client.index({
                    index: "patient-list",
                    id: o.id,
                    body: o,
                });
            } catch (error) {
                console.log(error);
            }
        });
    }
}
