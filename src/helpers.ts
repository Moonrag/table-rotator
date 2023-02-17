export const numberIsSquare = (number: number): boolean => {
    if (number <= 0) {
        return false;
    }

    const squareRoot: number = Math.sqrt(number);
    return Math.trunc(squareRoot) === squareRoot;
}

export const capitalizeString = (string: string): string => (string && string[0].toUpperCase() + string.slice(1)) || "";
