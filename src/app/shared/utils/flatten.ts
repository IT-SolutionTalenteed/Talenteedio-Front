export function isObject(o) {
    return o instanceof Object && o.constructor === Object;
}

export const flatten = param =>
    Object.assign(
        {},
        ...Object.entries(param)
            .filter(([key, value]) => value)
            .map(([key, value]) => (isObject(value) ? flatten(value) : { [key]: value }))
    );


