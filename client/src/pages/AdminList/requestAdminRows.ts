import { RowsProp } from "@material-ui/data-grid";
import { getZoneMap } from "util/cache";
import { apiFetch, Endpoint } from "util/endpoints";

interface IResponseRow {
    id: number;
    first_name: string;
    last_name: string;
    zone: number;
    type: string;
    status: string;
}

const requestClientRows = async (
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
                type: "Worker",
                status: "Active",
            };
        });

        setRows(rows);
    } catch (e) {
        setRows([]);
    }

    setLoading(false);
};

export default requestClientRows;
