import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import {PractitionerParser} from './parsers/PractitionerParser';
import { Parser } from './parsers/Parser';
import { SheetPage, ParsedType, ParsedData } from './Data';
import { GOOGLE_SHEET_ID, GOOGLE_SPREADSHEETS_RAW_DATA_KEY, GOOGLE_API_KEY } from './Constants';
import { PatientParser } from './parsers/PatientParser';
import { ClinicalImpressionParser } from './parsers/ClinicalImpressionParser';
import { FamilyMemberHistoryParser } from './parsers/FamilyMemberHistory';
import {ServiceRequestParser} from "./parsers/ServiceRequestParser";
import { OrganizationParser } from './parsers/OgranizationParser';
import { PractitionerRoleParser } from './parsers/PractitionerRoleParser';

type ParsingEntry = {
    parser: Parser<ParsedType>,
    data?: Promise<GoogleSpreadsheetRow[]>
}

export class GoogleSheetLoader {
    private static readonly parsers: {[key in SheetPage]?: ParsingEntry} = {};

    public static async load() : Promise<ParsedData[]> {
        try {
            GoogleSheetLoader.loadParsers();
            await GoogleSheetLoader.extractData();
            await GoogleSheetLoader.parse();
            return GoogleSheetLoader.parsedData;
        } catch(e) {
            console.error(e);
            throw new Error(`Failed to load data from Google Sheet: ${e}`);
        }
    }

    private static get parsedData() {
        const data: ParsedData[] = [];
        for(const key in this.parsers) {
            const page = SheetPage[key as keyof typeof SheetPage];
            const entry = this.parsers[page];
            data.push({
                data: entry.parser.parsed,
                dependencies: entry.parser.dependencies,
                page
            });
        }
        return data;
    }

    private static async extractData() {
        const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
        // await doc.useServiceAccountAuth(Credentials);
        await doc.useApiKey(GOOGLE_API_KEY);
        await doc.loadInfo();

        for (let i = 0; i < doc.sheetCount; i += 1) {
            const sheet = doc.sheetsByIndex[i];

            const type: SheetPage = SheetPage[sheet.title as keyof typeof SheetPage];

            if (type != null && this.parsers[type] != null) {
                this.parsers[type].data = sheet.getRows();
            }
        }
    }

    private static async parse() {
        const processEntries: Promise<void>[] = [];
        for(const key in this.parsers) {
            const entry = this.parsers[SheetPage[key as keyof typeof SheetPage]];
            if(entry != null) {
                processEntries.push(this.executeParser(entry));
            }
        }
        await Promise.all(processEntries);
    }

    private static async executeParser(entry: ParsingEntry): Promise<void> {
        if(entry.data != null) {
            const data = (await entry.data);
            entry.parser.parse(data.map(this.extractRawData));
        }
    }

    private static loadParsers(): void {
        this.parsers[SheetPage.Practitioner] = {parser: new PractitionerParser()};
        this.parsers[SheetPage.Patient] = {parser: new PatientParser()};
        this.parsers[SheetPage.ClinicalImpression] = {parser: new ClinicalImpressionParser()};
        this.parsers[SheetPage.FMH] = {parser: new FamilyMemberHistoryParser()};
        this.parsers[SheetPage.ServiceRequest] = {parser: new ServiceRequestParser()};
        this.parsers[SheetPage.Organisation] = {parser: new OrganizationParser()};
        this.parsers[SheetPage.PractitionerRole] = {parser: new PractitionerRoleParser()};
    }

    private static extractRawData(row: GoogleSpreadsheetRow): string[] { return row[GOOGLE_SPREADSHEETS_RAW_DATA_KEY]; }
}