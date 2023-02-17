# CSV Table Rotator
Simple library, that gets tables from CSV and rotate it.

## Getting started
Simply clone this repo and run `npm install && npm run build`

### Import
```typescript
import * as csvTableRotator from './index';
import path from 'path';

const filename = 'input.csv';

const stream = csvTableRotator.createStream(path.join(process.cwd(), filename), {
    way: 'left', // default: 'right'
    times: 7, // default: 1
});
stream.pipe(process.stdout);
```

If you need to rotate any array, you can simply utilize `TableRotator` class:
```typescript
import { TableRotator } from './TableRotator';

// make sure that table has identical rows and columns number!
const array = [1, 2, 3, 4];

const tableRotator = new TableRotator(array);
console.log(tableRotator.getTable());
// [1, 2, 3, 4]
console.log(tableRotator.rotateRight());
// [3, 1, 4, 2]
console.log(tableRotator.rotateLeft(2));
// 2 times to left from prev result: [2, 4, 1, 3]
```

### CLI
`node build/cli.js input.csv > output.csv`

or with options:

`node build/cli.js input.csv {"way":"left","times":5} > output.csv`

## How it works?

### Indexes for n-sized matrix:

|    0   |     1    |     2    |     3    |    ...   | ... |      n-2      |      n-1      |
|:------:|:--------:|:--------:|:--------:|:--------:|:---:|:-------------:|:-------------:|
|    n   |    n+1   |    n+2   |    n+3   |    ...   | ... |    n+(n-2)    |    n+(n-1)    |
|   2n   |   2n+1   |   2n+2   |   2n+3   |    ...   | ... |    2n+(n-2)   |    2n+(n-1)   |
|   3n   |   3n+1   |   3n+2   |   3n+3   |    ...   | ... |    3n+(n-2)   |    3n+(n-1)   |
|   ...  |    ...   |    ...   |    ...   |    ...   | ... |      ...      |      ...      |
| (n-1)n | (n-1)n+1 | (n-1)n+2 | (n-1)n+3 | (n-1)n+4 | ... | (n-1)n+ (n-2) | (n-1)n+ (n-1) |

To perform the rotation, we need to know indexes of "outer squares", in order: from top left corner -> top right -> bottom right -> bottom left -> top left (excluded). 

Calculating this indexes is pretty simple:
- calculate the starting point `i * (n + 1)`, where `i` is current itteration (starting from 0)
- on top side we always got `+1` from last known index `k - 1` times, where `k` is current outer square size (`k = n - 2i`)
- on right side we got `+n` from last known index `k - 1` times
- on bottom side we got `-1` from last known index `k - 1` times
- on left side we got `-n` from last known index `k - 2` times

Then in original table we can shift data based on obtained arrays of indexes.

### Example calculating the indexes for 5x5 table:
#### Indexes for the first "outer square":


| 0  | 1  | 2  | 3  | 4  |
|----|----|----|----|----|
| 5  | 6  | 7  | 8  | 9  |
| 10 | 11 | 12 | 13 | 14 |
| 15 | 16 | 17 | 18 | 19 |
| 20 | 21 | 22 | 23 | 24 |


k = 5

Starting point: `0`

Top side: `[1, 2, 3, 4]`

Right side: `[9, 14, 19, 24]`

Bottom side: `[23, 22, 21, 20]`

Left side: `[15, 10, 5]`

or merged:

`[0, 1, 2, 3, 4, 9, 14, 19, 24, 23 ,22, 21, 20, 15, 10, 5]`

#### Indexes for the second "outer square":

k = 3

Starting point: `6`

Top side: `[7, 8]`

Right side: `[13, 18]`

Bottom side: `[17, 16]`

Left side: `[11]`

or merged:

| 6  | 7  | 8  |
|----|----|----|
| 11 | 12 | 13 |
| 16 | 17 | 18 |

`[6, 7, 8, 13, 18, 17, 16, 11]`

#### Indexes for the third "outer square":

| 12  |
|-----|

___Nothing to do here :D___
