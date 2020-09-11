import { Parser } from './Parser';
import { SheetPage, Practitioner } from '../data/Data';
import { Indices } from '../data/Constants';

export class PractitionerParser extends Parser<Practitioner> {
    public get sheetType(): SheetPage {
        return SheetPage.Practitioner;
    }

    public get dependencies(): SheetPage[] {
        return [];
    }

    public parseRow(row: string[]): Practitioner {
        const id = row[Indices.PRACTITIONER.ID];
        const md = row[Indices.PRACTITIONER.LICENSE_NUMBER];
        const use = row[Indices.PRACTITIONER.MD_USE];
        const family = row[Indices.PRACTITIONER.FAMILY_NAME];
        const given = row[Indices.PRACTITIONER.GIVEN_NAME];
        const prefix = row[Indices.PRACTITIONER.PREFIX];
        const suffix = row[Indices.PRACTITIONER.SUFFIX];

        return {
            resourceType: 'Practitioner',
            id,
            identifier: [{
                type: {
                    coding: [
                        {
                            code: 'MD',
                            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                            display: 'Medical License number',
                        },
                    ],
                    text: 'Numéro de License Médicale du Québec',
                },
                use,
                value: md,
            }],
            meta: {
                profile: [
                    'http://hl7.org/fhir/StructureDefinition/Practitioner',
                ],
            },
            name: [{
                use,
                family,
                given: [
                    given,
                ],
                prefix: [prefix],
                suffix: [suffix],
            }],
        };
    }
}
