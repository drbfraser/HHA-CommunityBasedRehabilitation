import { RowsProp } from "@material-ui/data-grid";
import { getZones } from "@cbr/common/util/hooks/zones";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { UserRole, userRoles } from "@cbr/common/util/users";

interface IResponseRow {
    id: number;
    zone: number;
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
        const zoneMap = await getZones();
        const rows: RowsProp = responseRows.map((responseRow) => {
            return {
                id: responseRow.id,
                zone: zoneMap.get(responseRow.zone) ?? "",
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
