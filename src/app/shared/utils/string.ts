// Get the index of the nth occurent of a single character

export const nthOccurenceOf = (char, nth: number, str: string) => {
    let counter = 0;
    let res = str.length;
    str.split('').forEach((c, i) => {
        counter += counter < nth && c === char ? 1 : 0;
        if (counter === nth) {
            res = i;
            counter++;
        }
    });
    return res;
};
