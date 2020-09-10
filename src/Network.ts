import { ParsedData, SheetPage } from "./Data";

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

	public upload(): void {
		for(const key in this.networkData){
			const page = SheetPage[key as keyof typeof SheetPage];
			this.uploadEntry(page);
		}
	}	

	private uploadEntry(page: SheetPage){
		const data = this.networkData[page];

		if(data == null){
			throw new Error(`Cannot find parsed data for [${page}]`);
		}
		
		if(data.uploaded){
			return;
		}

		// Upload the dependencies first
		data.parsed.dependencies.forEach(dependency => this.uploadEntry(dependency));

		console.log(data.parsed.page);
		data.uploaded = true;
	}
}