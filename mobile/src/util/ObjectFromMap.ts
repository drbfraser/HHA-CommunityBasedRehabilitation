export const objectFromMap = <K extends string | number | symbol, V>(
    map: Map<K, V> | ReadonlyMap<K, V>
): Record<K, V> => {
    const obj: Partial<Record<K, V>> = {};
    for (const entry of map) {
        const [key, value] = entry;
        obj[key] = value;
    }
    return obj as Record<K, V>;
};
