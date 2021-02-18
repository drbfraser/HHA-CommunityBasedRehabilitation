import { Endpoint, apiFetch } from "./endpoints";

export const addClient = async (clientInfo: string) => {
    const init: RequestInit = {
        method: "POST",
        body: clientInfo,
    };

    return await apiFetch(Endpoint.CLIENTS, init);
};
