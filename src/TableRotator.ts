import { Table } from "./types";

export class TableRotator {
    private table: Table;

    public constructor(table: Table) {
        this.table = table;
    }

    public getTable(): Table {
        return this.table;
    }

    public rotateRight(): Table {
        const tableSideLength = Math.sqrt(this.table.length);
        const squaresAmount = Math.trunc(tableSideLength / 2);

        for (let i = 0; i < squaresAmount; i++) {
            const squareLength = tableSideLength - (i * 2);
            const unfoldedSquareLength = squareLength * 4 - 4;

            const firstPointIndex = (tableSideLength + 1) * i;
            const replacingQueue = [firstPointIndex];
            const backupedValue = this.table[firstPointIndex];

            let currentPointIndex = firstPointIndex + tableSideLength; // step down always be +tableSideLength

            for (let j = 1; j < unfoldedSquareLength; j++) {
                replacingQueue.push(currentPointIndex);
                this.table[replacingQueue.shift()] = this.table[currentPointIndex];

                if (j < squareLength - 1) {
                    currentPointIndex += tableSideLength;
                    continue;
                }

                if (j < squareLength * 2 - 2) {
                    currentPointIndex += 1;
                    continue;
                }

                if (j < squareLength * 3 - 3) {
                    currentPointIndex -= tableSideLength;
                    continue;
                }

                currentPointIndex -= 1;
            }
            this.table[replacingQueue.shift()] = backupedValue;
        }

        return this.table;
    }

    public rotateLeft(): Table {
        const tableSideLength = Math.sqrt(this.table.length);
        const squaresAmount = Math.trunc(tableSideLength / 2);

        for (let i = 0; i < squaresAmount; i++) {
            const squareLength = tableSideLength - (i * 2);
            const unfoldedSquareLength = squareLength * 4 - 4;

            const firstPointIndex = (tableSideLength + 1) * i;
            const replacingQueue = [firstPointIndex];
            const backupedValue = this.table[firstPointIndex];

            let currentPointIndex = firstPointIndex + 1; // step right always be +1

            for (let j = 1; j < unfoldedSquareLength; j++) {
                replacingQueue.push(currentPointIndex);
                this.table[replacingQueue.shift()] = this.table[currentPointIndex];

                if (j < squareLength - 1) {
                    currentPointIndex += 1;
                    continue;
                }

                if (j < squareLength * 2 - 2) {
                    currentPointIndex += tableSideLength;
                    continue;
                }

                if (j < squareLength * 3 - 3) {
                    currentPointIndex -= 1;
                    continue;
                }

                currentPointIndex -= tableSideLength;
            }
            this.table[replacingQueue.shift()] = backupedValue;
        }

        return this.table;
    }
}
