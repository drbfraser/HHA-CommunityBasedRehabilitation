/**
 * A better way of counting the number of keys in an object, since `Object.keys(...).length`
 * creates a new array.
 *
 * Generally, benchmarks show that this is close to the same speed or better than using the
 * `Object.keys` approach:
 * - https://jsben.ch/y5BsJ
 * - https://jsbench.me/39krs53k73/2
 *
 * @return The number of (enumerable) keys in `obj`.
 */
export const countObjectKeys = (obj: any): number => {
    let count = 0;
    for (const key in obj) {
        ++count;
    }
    return count;
};
