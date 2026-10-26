// How long a request waits for the response to start. Generous enough for a slow or distant link.
export const DEFAULT_FETCH_TIMEOUT_MILLIS = 10000;
// Sync can take much longer than other requests: a phone's first sync downloads all the data, and
// the server builds the whole response before sending it.
export const SYNC_FETCH_TIMEOUT_MILLIS = 120000;
// Image downloads can queue behind each other on a slow link.
export const IMAGE_FETCH_TIMEOUT_MILLIS = 30000;
// Saving a success story uploads its photos (up to ~1.3 MB) before the response can start.
export const STORY_SAVE_TIMEOUT_MILLIS = 60000;
