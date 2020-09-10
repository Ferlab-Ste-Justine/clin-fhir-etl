import { SheetPage, ParsedType } from '../Data';


export abstract class Parser<T extends ParsedType> {
	protected rawData: string[][];

	protected parsedData: T[];

	public get parsed(): T[] {
		return this.parsedData;
	}

	public abstract get dependencies(): SheetPage[];

	public abstract get sheetType(): SheetPage;

	public abstract parseRow (row: string[]): T;

	public parse(data: string[][]): void {
		this.rawData = data;
		this.parsedData = [];

		const length = this.rawData.length;
		if(length === 0){
			return;
		}

		const isClean = (row: string[]) => row.length === length;
		this.parsedData = this.rawData.filter(isClean).map(this.parseRow);
	}
}
