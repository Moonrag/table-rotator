import * as csvTableRotator from './index';

const options = process.argv[3] ? JSON.parse(process.argv[3]) : {};

if (process.argv.length < 3) {
    throw new Error('No input file provided.');
}
const stream = csvTableRotator.createStream(process.argv[2], options);
stream.pipe(process.stdout);
