import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { Parser } from '../parsers/Parser';
import { SheetPage, ParsedType, ParsedData } from '../data/Data';
import { GOOGLE_SHEET_ID, GOOGLE_SPREADSHEETS_RAW_DATA_KEY, GOOGLE_API_KEY } from '../data/Constants';
import {
    PractitionerParser,
    PatientParser,
    ClinicalImpressionParser,
    FamilyMemberHistoryParser,
    ServiceRequestParser,
    OrganizationParser,
    PractitionerRoleParser,
    ObservationParser
} from '../parsers';

import { AppLogger } from '../log/Logger';

type ParsingEntry = {
    parser: Parser<ParsedType>,
    data?: Promise<GoogleSpreadsheetRow[]>
}

export class GoogleSheetLoader {
    private static readonly parsers: {[key in SheetPage]?: ParsingEntry} = {};

    /**
     * Async method that reads the data from Google Sheet, and parsed it.
     * @returns Promise with a list of parsed data from Google Sheet.
     */
    public static async load() : Promise<ParsedData[]> {
        try {
            GoogleSheetLoader.registerParsers();
            await GoogleSheetLoader.extractData();
            await GoogleSheetLoader.parse();
            return GoogleSheetLoader.parsedData;
        } catch(e) {
            AppLogger.of("main").error(e);
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

    /**
     * Async function that connects to Google Sheet using the 
     * GOOGLE API KEY provided, and store async function 
     * to load data for each page.
     */
    private static async extractData() {
        const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
        doc.useApiKey(GOOGLE_API_KEY);
        await doc.loadInfo();

        for (let i = 0; i < doc.sheetCount; i += 1) {
            const sheet = doc.sheetsByIndex[i];

            const type: SheetPage = SheetPage[sheet.title as keyof typeof SheetPage];

            if (type != null && this.parsers[type] != null) {
                this.parsers[type].data = sheet.getRows();
            }
        }
    }

    /**
     * Load the data for each page and parse it.
     */
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

    /**
     * Register all the parsers to use.
     */
    private static registerParsers(): void {
        this.parsers[SheetPage.Practitioner] = {parser: new PractitionerParser()};
        this.parsers[SheetPage.Patient] = {parser: new PatientParser()};
        this.parsers[SheetPage.ClinicalImpression] = {parser: new ClinicalImpressionParser()};
        this.parsers[SheetPage.Observation] = {parser: new ObservationParser()};
        this.parsers[SheetPage.FMH] = {parser: new FamilyMemberHistoryParser()};
        this.parsers[SheetPage.ServiceRequest] = {parser: new ServiceRequestParser()};
        this.parsers[SheetPage.Organisation] = {parser: new OrganizationParser()};
        this.parsers[SheetPage.PractitionerRole] = {parser: new PractitionerRoleParser()};
    }

    private static extractRawData(row: GoogleSpreadsheetRow): string[] { return row[GOOGLE_SPREADSHEETS_RAW_DATA_KEY]; }
}