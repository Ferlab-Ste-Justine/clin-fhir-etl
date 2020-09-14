import { SheetPage, ParsedType, ResourceType, Reference } from '../data/Data';


export abstract class Parser<T extends ParsedType> {
    protected rawData: string[][];
    protected parsedData: T[];

    public get parsed(): T[] {
        return this.parsedData;
    }

    /**
     * Other pages that are referenced to from this document. 
     */
    public abstract get dependencies(): SheetPage[];

    /**
     * Type parsed by the parser.
     */
    public abstract get sheetType(): SheetPage;

    /**
     * Takes a list of string and parse an object of type @type T
     * @param row List of string data of the row
     */
    public abstract parseRow (row: string[]): T;

    /**
     * Iterate through each line in @param data and parse an object @type T.
     * The parsed data is then stored in @property parsedData.
     * @param data All the lines to parse
     */
    public parse(data: string[][]): void {
        this.rawData = data;
        this.parsedData = [];

        const length = this.rawData.length;
        if(length === 0) {
            return;
        }
        this.parsedData = this.rawData.map(this.parseRow);
    }

    protected static createRef(resourceType: ResourceType, id: string): Reference {
        return {
            reference: `${resourceType}/${id}`
        };
    }
}
