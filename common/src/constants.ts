// How long a request waits for the response to start. Generous enough for a slow or distant link.
export const DEFAULT_FETCH_TIMEOUT_MILLIS = 10000;
// Sync can take much longer than other requests: a phone's first sync downloads all the data, and
// the server builds the whole response before sending it.
export const SYNC_FETCH_TIMEOUT_MILLIS = 120000;
// Image downloads can queue behind each other on a slow link.
export const IMAGE_FETCH_TIMEOUT_MILLIS = 30000;
// Requests that upload photos (a success story's, up to ~1.3 MB) or wait for the server to send an
// email with one (bug reports): the response can only start after that.
export const UPLOAD_FETCH_TIMEOUT_MILLIS = 60000;
