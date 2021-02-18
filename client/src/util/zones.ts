import { Endpoint, apiFetch } from "./endpoints";

export const getAllZones = async () => {
    const init: RequestInit = {
        method: "GET",
    };

    return await apiFetch(Endpoint.ZONES, init)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res;
        });
};
