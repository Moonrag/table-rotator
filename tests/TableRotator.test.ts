import { TableRotator } from "../src/TableRotator";
import { describe } from "node:test";

/**
 * Creating simple array, contains number from 1 to count
 * @param count
 */
const createSimpleArray = (count: number) => {
    return Array.from(new Array(count), (x, i) => i + 1)
}

describe('testing TableRotator class', () => {
    test('rotate 4x4 table left', () => {
        const table = new TableRotator(createSimpleArray(4 * 4));
        expect(table.rotateLeft()).toEqual([2, 3, 4, 8, 1, 7, 11, 12, 5, 6, 10, 16, 9, 13, 14, 15]);
    });

    test('rotate 5x5 table right', () => {
        const table = new TableRotator(createSimpleArray(5 * 5));
        expect(table.rotateRight())
            .toEqual([6, 1, 2, 3, 4, 11, 12, 7, 8, 5, 16, 17, 13, 9, 10, 21, 18, 19, 14, 15, 22, 23, 24, 25, 20]);
    });

    test('rotate 3x3 table right and get it with getTable method', () => {
        const table = new TableRotator(createSimpleArray(3 * 3));
        table.rotateRight();
        expect(table.getTable()).toEqual([4, 1 ,2, 7, 5, 3, 8, 9, 6]);
    });
});
