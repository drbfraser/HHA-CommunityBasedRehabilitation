import { RowsProp } from "@material-ui/data-grid";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";

interface IResponseRow {
    id: number;
    zone_name: number;
}

const requestZoneRows = async (
    setFilteredRows: (rows: RowsProp) => void,
    setServerRows: (rows: RowsProp) => void,
    setLoading: (loading: boolean) => void
) => {
    setLoading(true);

    let urlParams: string = "";

    try {
        const resp = await apiFetch(Endpoint.ZONES, urlParams);

        const responseRows: IResponseRow[] = await resp.json();
        const rows: RowsProp = responseRows.map((responseRow) => {
            return {
                id: responseRow.id,
                zone: responseRow.zone_name ?? "",
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

export default requestZoneRows;
