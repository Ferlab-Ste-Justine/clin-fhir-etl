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

		this.parsedData = this.rawData.map(this.parseRow);
	}
}
