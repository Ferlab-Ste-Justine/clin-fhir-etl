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