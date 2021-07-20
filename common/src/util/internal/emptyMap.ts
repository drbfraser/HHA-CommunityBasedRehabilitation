/**
 * A static empty {@link Map} so we don't create new maps whenever we need an empty
 * {@link ReadonlyMap}.
 *
 * JS engines might implement maps using hash tables. For example, in V8 (used in Chrome), maps
 * keep track of state and buckets in a single array. (See
 * {@link https://itnext.io/v8-deep-dives-understanding-map-internals-45eb94a183df}). It would be
 * (theoretically) better to just use a pre-allocated empty ReadonlyMap in places where we need to
 * use an empty ReadonlyMap to avoid allocating extra arrays. This is similar to Java's
 * `Collections.emptyMap` or Kotlin's `emptyMap`, although in Kotlin's case, they implement the
 * Map interface and stub it out with constants.
 *
 * @see https://github.com/JetBrains/kotlin/blob/bf40c07cc372fb8467f5a9dceb099bea515d2250/libraries/stdlib/src/kotlin/collections/Maps.kt#L14-L32
 */
const emptyMap: ReadonlyMap<any, any> = new Map();

export default emptyMap;
