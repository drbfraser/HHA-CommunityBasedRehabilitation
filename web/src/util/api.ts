export const API_BASE_URL =
    process.env.NODE_ENV === "development" ? `http://${window.location.hostname}:8000` : "";

export const API_URL = API_BASE_URL + "/api/";
