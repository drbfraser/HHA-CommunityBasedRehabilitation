import { API_URL, Endpoint } from "./endpoints";
import { getAuthToken } from "./auth";

export const addClient = async (clientInfo: string) => {
    const init: RequestInit = {
        method: "POST",
        body: clientInfo,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + (await getAuthToken()),
        },
    };

    try {
        await fetch(API_URL + Endpoint.CLIENTS, init);
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
};
