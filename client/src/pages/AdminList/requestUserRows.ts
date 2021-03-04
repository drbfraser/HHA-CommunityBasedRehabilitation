import { RowsProp } from "@material-ui/data-grid";
import { getZoneMap } from "util/cache";
import { apiFetch, Endpoint } from "util/endpoints";

interface IResponseRow {
    id: number;
    first_name: string;
    last_name: string;
    zone: number;
    type: string;
    is_active: string;
}

const requestUserRows = async (
    setRows: (rows: RowsProp) => void,
    setLoading: (loading: boolean) => void
) => {
    setLoading(true);

    let urlParams: string = "";

    try {
        const resp = await apiFetch(Endpoint.USERS, urlParams);

        const responseRows: IResponseRow[] = await resp.json();
        const zoneMap = await getZoneMap();
        const rows: RowsProp = responseRows.map((responseRow) => {
            return {
                id: responseRow.id,
                name: responseRow.first_name + " " + responseRow.last_name,
                zone: zoneMap.get(responseRow.zone) ?? "",
                // TODO: Change type to actual type once backend supports it
                type: "Worker",
                // TODO: Change status to actual status once backend supports it
                status: "Active",
            };
        });

        setRows(rows);
    } catch (e) {
        setRows([]);
    }

    setLoading(false);
};

export default requestUserRows;
