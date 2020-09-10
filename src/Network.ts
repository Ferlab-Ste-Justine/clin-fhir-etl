import { ParsedData, SheetPage } from "./Data";
import { Api } from "./Api";
import { AppLogger } from "./Logger";

type NetworkData = {
	parsed: ParsedData;
	uploaded: boolean;
}

export class Network{
	private readonly networkData: {[key in SheetPage]?: NetworkData} = {};

	constructor(private readonly parsedDatas: ParsedData[]) {
		this.parsedDatas.forEach(parsed => this.networkData[parsed.page] = {
			parsed, 
			uploaded: false,
		});
	}

	public async upload(): Promise<void> {
		for(const key in this.networkData){
			const page = SheetPage[key as keyof typeof SheetPage];
			await this.uploadEntry(page);
		}
	}	

	private async uploadEntry(page: SheetPage){
		const data = this.networkData[page];

		if(data == null){
			throw new Error(`Cannot find parsed data for [${page}]`);
		}
		
		if(data.uploaded){
			return;
		}

		// Upload the dependencies first
		data.parsed.dependencies.forEach(async dependency => await this.uploadEntry(dependency));
		AppLogger.of("net").warn(`Processing ${page}`);
		await Api.upload(data.parsed.data);
		data.uploaded = true;
	}
}