export type ClientTest = {
    id: number;
    full_name: string;
    zone: number;
}

export const fetchClientsFromApi = async () => {
    const endpoint = `http://localhost:8000/api/clients`;
    const data = await (await fetch(endpoint)).json();
    console.log(data);
    return data.results.map((client: ClientTest) => (
        {
            id: client.id,
            first_name: client.full_name,
            zone: client.zone,
        }
    ));
}   