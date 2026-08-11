export const API_BASE_URL = import.meta.env.DEV ? `http://${window.location.hostname}:8000` : "";

export const API_URL = API_BASE_URL + "/api/";
