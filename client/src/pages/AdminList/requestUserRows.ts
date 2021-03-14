import { RowsProp } from "@material-ui/data-grid";
import { apiFetch, Endpoint } from "util/endpoints";

interface IResponseRow {
    id: number;
    first_name: string;
    last_name: string;
    type: string;
    is_active: string;
}

const requestUserRows = async (
    setFilteredRows: (rows: RowsProp) => void,
    setServerRows: (rows: RowsProp) => void,
    setLoading: (loading: boolean) => void
) => {
    setLoading(true);

    let urlParams: string = "";

    try {
        const resp = await apiFetch(Endpoint.USERS, urlParams);

        const responseRows: IResponseRow[] = await resp.json();
        const rows: RowsProp = responseRows.map((responseRow) => {
            return {
                id: responseRow.id,
                first_name: responseRow.first_name,
                last_name: responseRow.last_name,
                name: responseRow.first_name + " " + responseRow.last_name,
                // TODO: Change type to actual type once backend supports it
                type: "Worker",
                // TODO: Change status to actual status once backend supports it
                status: "Active",
            };
        });

        setFilteredRows(rows);
        setServerRows(rows);
    } catch (e) {
        setFilteredRows([]);
        setServerRows([]);
    }

    setLoading(false);
};

export default requestUserRows;
