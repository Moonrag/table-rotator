import * as csvIn from 'csv-stream';
import * as csvOut from 'fast-csv';
import * as fs from "fs";
import { TableRotator } from "./TableRotator";
import { numberIsSquare, capitalizeString } from "./helpers";
import { Header, Row, Table, OptionsArgs } from "./types";

export function createStream(filename: string, option: OptionsArgs = {}): csvOut.CsvFormatterStream<csvOut.FormatterRow, csvOut.FormatterRow> {
    const csvTableRotator = new CsvTableRotator(filename, option);
    return csvTableRotator.getStream();
}

class CsvTableRotator {
    private csvInputStream: any;
    private csvOutputStream: csvOut.CsvFormatterStream<csvOut.FormatterRow, csvOut.FormatterRow>;
    private options: OptionsArgs;

    public constructor(path: string, options: OptionsArgs) {
        this.options = {
            way: options.way ?? 'right',
        };

        this.csvInputStream = csvIn.createStream({ enclosedChar: '"' });
        this.csvOutputStream = csvOut.format({
            headers: true,
            quoteColumns: { json: true },
            quoteHeaders: false,
        });

        fs.createReadStream(path).pipe(this.csvInputStream)
            .on('error', (err: unknown) => console.error(err))
            .on('header', (header: Array<any>) => this.handleCsvHeader(header))
            .on('data', (row: { id: any, json: any, undefined?: any }) => this.handleCsvRow(row))
            .on('end', () => {
                this.csvOutputStream.end();
            });
    }

    public getStream() {
        return this.csvOutputStream;
    }

    private handleCsvHeader( header: Array<any> ) {
        if (!this.isHeader(header)) {
            throw new Error('CSV has wrong headers. Expected: id, json.')
        }
    }

    private handleCsvRow(row: { id: any, json: any, undefined?: any } ) {
        if (typeof row.id === 'string' && row.id.trim() === '') {
            console.warn('ID in row is empty, skipped.');
            return;
        }

        if (!this.isRow(row)) {
            this.writeOutputForInvalidRow(row.id);
            return;
        }

        let table: any;

        try {
            table = JSON.parse(row.json);
        } catch (e) {
            this.writeOutputForInvalidRow(row.id);
            return;
        }

        if (!this.isTable(table)) {
            this.writeOutputForInvalidRow(row.id);
            return;
        }

        const tableRotator = new TableRotator(table);
        const methodName = 'rotate' + capitalizeString(this.options.way);
        tableRotator[methodName]();

        this.csvOutputStream.write({
            id: row.id,
            json: `[${tableRotator.getTable().join(', ')}]`,
            is_valid: true,
        });
    };

    private writeOutputForInvalidRow(id: string) {
        this.csvOutputStream.write({
            id: id,
            json: '[]',
            is_valid: false,
        });
    }

    private isHeader = (header: Array<any> | Header): header is Header =>
        (header as Header)[0] === 'id'
        && (header as Header)[1] === 'json'
        && header.length === 2;

    private isRow = (row: { id: any, json: any, undefined?: any } | Row): row is Row =>
        typeof row.id === 'string'
        && typeof row.json === 'string'
        && !row.hasOwnProperty('undefined')
        && Object.keys(row).length === 2;

    private isTable = (table: any): table is Table =>
        Array.isArray(table)
        && table.every(el => typeof el === 'number')
        && this.tableHasIdenticalColumnsAndRowsNumber(table);

    private tableHasIdenticalColumnsAndRowsNumber = (table: Table) => numberIsSquare(table.length);
}

