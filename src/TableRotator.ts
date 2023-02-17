import { Table } from "./types";

export class TableRotator {
    private table: Table;
    private squaresIndexes: number[][] = [];

    public constructor(table: Table) {
        this.table = table;
        this.buildSquaresIndexes();
    }

    public getTable(): Table {
        return this.table;
    }

    public rotateRight(times: number = 1): Table {
        const calculateShiftedIndex = (index: number, length: number): number => {
            const reducedTimes = times % length;
            return index + reducedTimes >= length
                ? index + reducedTimes - length
                : index + reducedTimes;
        }

        this.performRotation(calculateShiftedIndex);

        return this.table;
    }

    public rotateLeft(times: number = 1): Table {
        const calculateShiftedIndex = (index: number, length: number): number => {
            const reducedTimes = times % length;
            return index - reducedTimes < 0
                ? length + index - reducedTimes
                : index - reducedTimes;
        }

        this.performRotation(calculateShiftedIndex);

        return this.table;
    }

    private buildSquaresIndexes() {
        const tableSideLength = Math.sqrt(this.table.length);
        const squaresAmount = Math.trunc(tableSideLength / 2);

        for (let i = 0; i < squaresAmount; i++) {
            let currentPoint = (tableSideLength + 1) * i;
            const unfoldedSquare: number[] = [];

            const squareLength = tableSideLength - (i * 2);
            const unfoldedSquareLength = squareLength * 4 - 4;

            for (let j = 0; j < unfoldedSquareLength; j++) {
                unfoldedSquare.push(currentPoint);

                if (j < squareLength - 1) {
                    currentPoint += 1;
                    continue;
                }

                if (j < squareLength * 2 - 2) {
                    currentPoint += tableSideLength;
                    continue;
                }

                if (j < squareLength * 3 - 3) {
                    currentPoint -= 1;
                    continue;
                }

                currentPoint -= tableSideLength;
            }
            this.squaresIndexes.push(unfoldedSquare);
        }
    }

    private performRotation(calculateShiftedIndex: (index: number, length: number) => number) {
        const replaceMap = {};

        this.squaresIndexes.forEach(singleSquareIndexes => {
            const length = singleSquareIndexes.length;
            singleSquareIndexes.forEach((indexFrom, index) => {
                const indexTo = singleSquareIndexes[calculateShiftedIndex(index, length)];
                replaceMap[indexTo] = this.table[indexFrom];
            })
        });

        if (this.table.length % 2 === 1) {
            const middleElementIndex = (this.table.length - 1) / 2;
            replaceMap[middleElementIndex] = this.table[middleElementIndex];
        }

        this.table = Object.values(replaceMap);
    }
}
