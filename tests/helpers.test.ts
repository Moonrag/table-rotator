import { numberIsSquare, capitalizeString } from "../src/helpers";
import { describe } from "node:test";

describe('testing "numberIsSquare" function', () => {
    test('4 is square number', () => {
        expect(numberIsSquare(4)).toBe(true);
    });
    test('9 is square number', () => {
        expect(numberIsSquare(9)).toBe(true);
    });
    test('144 is square number', () => {
        expect(numberIsSquare(144)).toBe(true);
    });
    test('10000 is square number', () => {
        expect(numberIsSquare(10000)).toBe(true);
    });

    test('8 is not square number', () => {
        expect(numberIsSquare(8)).toBe(false);
    });
    test('10 is not square number', () => {
        expect(numberIsSquare(10)).toBe(false);
    });
    test('73 is not square number', () => {
        expect(numberIsSquare(73)).toBe(false);
    });
    test('1481 is not square number', () => {
        expect(numberIsSquare(1481)).toBe(false);
    });
});

describe('testing "capitalizeString" function', () => {
    test('"abc" capitalized is "Abc"', () => {
        expect(capitalizeString('abc')).toBe('Abc');
    });
    test('"ABC" capitalized is "ABC"', () => {
        expect(capitalizeString('ABC')).toBe('ABC');
    })
});
