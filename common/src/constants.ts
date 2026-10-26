export const DEFAULT_FETCH_TIMEOUT_MILLIS = 5000;
// Sync can take much longer than other requests: a phone's first sync downloads all the data, and
// the server builds the whole response before sending it.
export const SYNC_FETCH_TIMEOUT_MILLIS = 120000;
