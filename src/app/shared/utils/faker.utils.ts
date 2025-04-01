export const takeOneRandomlyFrom = <T>(items: T[]) =>
    items[Math.floor(Math.random() * items.length)];

export const sliceRandomlyFrom = <T>(items: T[]): T[] => {
    let start: number; let end: number;
    do {
        start = Math.floor(Math.random() * items.length);
        end = Math.floor(Math.random() * items.length);
    } while (end < start);
    return items.slice(start, end + 1);
};
