import axios from 'axios';
import { ParsedType } from '../data/Data';
import { FHIR_SERVER_HOST } from '../data/Constants';
import { AppLogger } from '../log/Logger';

enum Method {
    GET ,
    POST ,
    DELETE,
    PUT
}

type BatchRequest = {
    method: string;
    url: string;
}

type BatchEntry = {
    request: BatchRequest;
    resource?: ParsedType;
}


type BatchBundle = {
    resourceType: "Bundle",
    id: "CLIN_FHIR_ETL",
    type: "batch",
    entry: BatchEntry[];
}

class Batch {
    /**
     * Bundle a set of resources in an object. The structure of the created object
     * can be seen here https://www.hl7.org/fhir/bundle.html, and can be
     * processed by the HAPI/FHIR server. 
     * @param method HTTP Method of the bundle (DELETE to remove, PUT to create, etc.)
     * @param resources Resources to bundle.
     */
    public static bundle(method: Method, resources: ParsedType[]): BatchBundle { 
        return  {
            resourceType: "Bundle",
            id: "CLIN_FHIR_ETL",
            type: "batch",
            entry: resources.map(resource => {
                if(method === Method.DELETE) {
                    return {
                        request:{
                            method: Method[method].toString(),
                            url: `${resource.resourceType}/${resource.id}`
                        },
                    };
                }
                return {
                    request:{
                        method: Method[method].toString(),
                        url: `${resource.resourceType}/${resource.id}`
                    },
                    resource,
                };
            })
        };
    }
}

export class Api {
    /**
     * Takes a set of parsed data and uploads it to FHIR Server.
     * The data is bundled and only two requests are made to the FHIR server.
     * The first request is to delete all the entries with the same ids as the data to uplaod.
     * The seconds request is to upload the data
     * @param data Parsed data to upload to FHIR Server
     */
    public static async upload(data: ParsedType[]): Promise<void> {
        if(data.length === 0) {
            return;
        }

        AppLogger.of("api").info(`Generating bundles.`);

        // Create a batch to delete all the FHIR entries with the same IDs
        const batchDelete = Batch.bundle(Method.DELETE, data);
        const batchCreate = Batch.bundle(Method.PUT, data);
        try {
            AppLogger.of("api").info("Deleting old entries from server.");
            await axios.post(FHIR_SERVER_HOST, batchDelete);
            AppLogger.of("api").info("Uploading new entries to server.");
            await axios.post(FHIR_SERVER_HOST, batchCreate);
        } catch (error) {
            AppLogger.of("api").error(error);
        }
    }
}