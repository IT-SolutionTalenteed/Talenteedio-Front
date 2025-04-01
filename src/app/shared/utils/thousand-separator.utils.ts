export namespace ThousandSeparatorUtils {
    const convertToString = (num: number): string => `${num}`;

    const applySeparator = (numStr: string): string => {
        const reversed = numStr.split('').reverse();
        let res = '';
        reversed.forEach((digit, i) => {
            res += digit;
            if (i % 3 === 2) {
                res += ' ';
            }
        });
        return res.split('').reverse().join('').trim();
    };

    const reduceLength = (numStr: string, count: number) =>
        numStr
            .split('')
            .filter((e, i) => i < count)
            .join('');

    const adjustFloat = (numStr: string, count: number): string => {
        if (numStr === '') {
            return '';
        }

        const complete = `0.${numStr}`;
        const numComplete: number = +complete;
        const floatPart = Math.ceil(numComplete * 10 ** count);
        return `${floatPart}`;
    };

    export const thousandSeparator = (num: number): string => {
        const parts = convertToString(num).split('.');
        const integerPart = parts[0];
        const floatPart = parts[1] || '';
        const adjustedFloatPart = adjustFloat(floatPart, 2);
        return `${applySeparator(integerPart)}${parts.length === 2 ? '.' : ''}${reduceLength(adjustedFloatPart, 2)}`;
    };
}
