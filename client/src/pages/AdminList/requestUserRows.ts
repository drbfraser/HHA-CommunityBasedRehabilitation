import { RowsProp } from "@material-ui/data-grid";
import { getZones } from "util/hooks/zones";
import { apiFetch, Endpoint } from "util/endpoints";
import { UserRole, userRoles } from "util/users";

interface IResponseRow {
    id: number;
    zone: number;
    first_name: string;
    last_name: string;
    role: UserRole;
    is_active: boolean;
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
                first_name: responseRow.first_name,
                last_name: responseRow.last_name,
                name: responseRow.first_name + " " + responseRow.last_name,
                role: userRoles[responseRow.role].name,
                status: responseRow.is_active ? "Active" : "Disabled",
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
