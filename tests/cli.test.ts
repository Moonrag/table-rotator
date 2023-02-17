import {spawn} from "child_process";
import path from "path";

describe('testing cli', () => {
    test('using cli to rotate tables from input.csv right 1 time', done => {
        const cliFilePath = path.join(__dirname, '../src/cli.ts');
        const inputDataFilePath = path.join(__dirname, '../input.csv');

        const testApp = spawn('ts-node', [cliFilePath, inputDataFilePath]);

        let stdout = '';

        testApp.stdout
            .on('data', data => {
                stdout += data.toString();
            })
            .on('end', () => {
                expect(stdout).toEqual('id,json,is_valid\n' +
                    '1,"[4, 1, 2, 7, 5, 3, 8, 9, 6]",true\n' +
                    '2,"[90, 40, 10, 20]",true\n' +
                    '3,"[-5]",true\n' +
                    '9,"[]",false\n' +
                    '5,"[]",false\n' +
                    '8,"[]",false');
                done();
            })
    })
});
