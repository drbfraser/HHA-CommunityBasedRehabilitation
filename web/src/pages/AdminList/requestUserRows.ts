import { GridRowsProp } from "@mui/x-data-grid";
import { getZones } from "@cbr/common/util/hooks/zones";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { UserRole, userRoles } from "@cbr/common/util/users";

interface IResponseRow {
    id: number;
    zone: number;
    first_name: string;
    last_name: string;
    username: string;
    role: UserRole;
    is_active: boolean;
}

const requestUserRows = async (
    setFilteredRows: (rows: GridRowsProp) => void,
    setServerRows: (rows: GridRowsProp) => void,
    setLoading: (loading: boolean) => void
) => {
    setLoading(true);

    let urlParams: string = "";

    try {
        const resp = await apiFetch(Endpoint.USERS, urlParams);

        const responseRows: IResponseRow[] = await resp.json();
        const zoneMap = await getZones();
        const rows: GridRowsProp = responseRows.map((responseRow) => {
            return {
                id: responseRow.id,
                zone: zoneMap.get(responseRow.zone) ?? "",
                first_name: responseRow.first_name,
                last_name: responseRow.last_name,
                name: responseRow.first_name + " " + responseRow.last_name,
                username: responseRow.username,
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
