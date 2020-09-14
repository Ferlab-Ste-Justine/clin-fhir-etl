import { ParsedData, SheetPage } from "../data/Data";
import { Api } from "./Api";
import { AppLogger } from "../log/Logger";

type NetworkData = {
    parsed: ParsedData;
    uploaded: boolean;
}

export class Network {
    private readonly networkData: {[key in SheetPage]?: NetworkData} = {};

    constructor(private readonly parsedDatas: ParsedData[]) {
        this.parsedDatas.forEach(parsed => this.networkData[parsed.page] = {
            parsed, 
            uploaded: false,
        });
    }

    /**
     * Iterate through all the parsed data and uploads them to FHIR Server.
     */
    public async upload(): Promise<void> {
        for(const key in this.networkData) {
            const page = SheetPage[key as keyof typeof SheetPage];
            await this.uploadEntry(page);
        }
    }	

    /**
     * Upload the parsed data of a page if its dependencies are all uploaded.
     * If one or more dependencies haven't been uploaded, this method calls
     * itself recursively with the dependency as @param page.
     * @param page Page to upload the data for.
     */
    private async uploadEntry(page: SheetPage) {
        const data = this.networkData[page];

        if(data == null) {
            throw new Error(`Cannot find parsed data for [${page}]`);
        }

        if(data.uploaded) {
            return;
        }

        // Upload the dependencies first
        for(const dependency of data.parsed.dependencies) {
            await this.uploadEntry(dependency);
        }
        
        AppLogger.of("net").warn(`Processing ${page}`);
        await Api.upload(data.parsed.data);
        data.uploaded = true;
    }
}