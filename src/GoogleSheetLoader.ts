import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import Credentials from './credentials.json';
import {PractitionerParser} from './parsers/PractitionerParser';
import { Parser } from './parsers/Parser';
import { SheetPage, ParsedType, ParsedData } from './Data';
import { GOOGLE_SHEET_ID, GOOGLE_SPREADSHEETS_RAW_DATA_KEY } from './Constants';

type ParsingEntry = {
	parser: Parser<ParsedType>,
	data?: Promise<GoogleSpreadsheetRow[]>
}


export class GoogleSheetLoader{
	private static readonly parsers: {[key in SheetPage]?: ParsingEntry} = {};

	public static async load() : Promise<ParsedData[]>{
		GoogleSheetLoader.loadParsers();
		await GoogleSheetLoader.extractData();
		await GoogleSheetLoader.parse();
		return GoogleSheetLoader.parsedData;
	}

	private static get parsedData() {
		const data: ParsedData[] = [];
		for(const key in this.parsers){
			const page = SheetPage[key as keyof typeof SheetPage];
			const entry = this.parsers[page];
			data.push({
				data: entry.parser.parsed,
				dependeciess: entry.parser.dependencies,
				page
			});
		}
		return data;
	}

	private static async extractData() {
		const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
		doc.useServiceAccountAuth(Credentials);

		await doc.loadInfo();
		console.log(doc.title);

		for (let i = 0; i < doc.sheetCount; i += 1) {
			const sheet = doc.sheetsByIndex[i];
			const title = sheet.title;

			const type: SheetPage = SheetPage[sheet.title as keyof typeof SheetPage];

			if (type != null && this.parsers[type] != null) {
				this.parsers[type].data = sheet.getRows();
			}
		}
	}

	private static async parse() {
		const processEntries: Promise<void>[] = [];
		for(const key in this.parsers){
			const entry = this.parsers[SheetPage[key as keyof typeof SheetPage]];
			if(entry != null){
				processEntries.push(this.executeParser(entry));
			}
		}
		await Promise.all(processEntries);
	}

	private static async executeParser(entry: ParsingEntry): Promise<void>{
		if(entry.data != null){
			const data = (await entry.data);
			entry.parser.parse(data.map(this.extractRawData));
		}
	}
	
	private static loadParsers(): void {
		this.parsers[SheetPage.Practitioner] = {parser: new PractitionerParser()};
	}

	private static extractRawData(row: GoogleSpreadsheetRow): string[]{ return row[GOOGLE_SPREADSHEETS_RAW_DATA_KEY]; }
}