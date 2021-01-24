const BASE_URL =
    process.env.NODE_ENV === "development"
        ? `http://${window.location.hostname}:8000/api/`
        : "/api/";

export const API_EXAMPLE = BASE_URL + "example";
