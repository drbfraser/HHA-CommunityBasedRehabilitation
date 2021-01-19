const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api/' : '/api/';
const FORMAT_JSON = '?format=json';

export const API_EXAMPLE = API_BASE_URL + 'example' + FORMAT_JSON;