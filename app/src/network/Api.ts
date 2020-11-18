import axios, { AxiosResponse } from 'axios';
import qs from 'querystring';
import { ParsedType } from '../data/Data';
import { v4 as uuid } from 'uuid';
import {  
    AUTH_REQUIRED,
    FHIR_AUTH_CLIENT_ID, 
    FHIR_AUTH_CLIENT_SECRET, 
    FHIR_AUTH_CLIN_REALM, 
    FHIR_AUTH_URL, 
    FHIR_SERVER_HOST, 
    MAX_AUTH_RETRY_COUNT
} from '../data/Constants';
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
    id: "clin",
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
            id: "clin",
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
                    fullUrl: `urn:uuid:${uuid()}`,
                    resource,
                };
            })
        };
    }
}

export class Api {
    private static counter = 0;
    private static token?: string = null;

    /**
     * Generate a new access token for the application to use.
     * The access token is generated from the Keyloack host specified
     * in the .env file.
     */
    private static async retrieveAccessToken() : Promise<void> {
        const url = `${FHIR_AUTH_URL}/auth/realms/${FHIR_AUTH_CLIN_REALM}/protocol/openid-connect/token`;
        try {
            const response = await axios.post(
                url,
                qs.stringify({
                    grant_type: "client_credentials",
                    client_secret: FHIR_AUTH_CLIENT_SECRET,
                    client_id: FHIR_AUTH_CLIENT_ID
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
    
            if(response.status !== 200) {
                throw new Error(response.data);
            }
            Api.token = response.data.access_token; 
        } catch (error) {
            AppLogger.of("api").error(error);
            throw error;
        }
    }

    /**
     * POST request to FHIR Server with the specified data and the authroization header. 
     * If the token has expired, it will call @function retrieveAccessToken to generate
     * a new access token.
     * @param data Bundle to send to FHIR server
     */
    private static async post<T extends BatchBundle>(data: T) : Promise<AxiosResponse<unknown>> {
        if(Api.counter > MAX_AUTH_RETRY_COUNT) {
            throw new Error(`Auth failed ${MAX_AUTH_RETRY_COUNT} times[MAXIMUM RETRY COUNT REACHED]`);
        }

        if(AUTH_REQUIRED && Api.token == null) {
            await Api.retrieveAccessToken();
        }

        try {
            const response = await axios.post(FHIR_SERVER_HOST, data, {
                headers:{
                    Authorization: `Bearer ${Api.token}`
                }
            });
            Api.counter = 0;
            return response;
        } catch(error) {
            const { response } = error;
            if(response != null && response.status === 401) {
                Api.token = null;
                Api.counter++;
                Api.post(data);
            } else {
                throw error;
            }
        }
    }

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
            await Api.post(batchDelete);
            AppLogger.of("api").info("Uploading new entries to server.");
            await Api.post(batchCreate);
        } catch (error) {
            AppLogger.of("api").error(error);
        }
    }
}