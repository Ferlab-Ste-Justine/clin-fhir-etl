import { SheetType, Practitioner } from '../Data';

type ParsedType = Practitioner;

export abstract class Parser<T extends ParsedType> {
	protected rawData: string[][];

	protected parsedData: T[];

	public get parsed(): T[] {
		return this.parsedData;
	}

	public abstract get dependencies(): SheetType[];

	public abstract get sheetType(): SheetType;

	public abstract parseRow (row: string[]): T;

	public parse(data: string[][]): void {
		this.rawData = data;
		this.parsedData = [];

		this.parsedData = this.rawData.map(this.parseRow);
	}
}
