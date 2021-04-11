import { RowsProp } from "@material-ui/data-grid";
import { IClientSummary } from "util/clients";
import { apiFetch, APILoadError, Endpoint } from "util/endpoints";
import { getCurrentUser } from "util/hooks/currentUser";
import { getZones } from "util/hooks/zones";
import { RiskType } from "util/risks";
import { SearchOption } from "./searchOptions";

const requestClientRows = async (
    setRows: (rows: RowsProp) => void,
    setLoading: (loading: boolean) => void,
    searchValue: string,
    searchOption: string,
    allClientsMode: boolean
) => {
    setLoading(true);

    searchValue = searchValue.trim();

    if (searchOption === SearchOption.NAME) {
        searchOption = "full_name";
    }

    try {
        const urlParams = new URLSearchParams();

        if (searchValue) {
            urlParams.append(searchOption.toLowerCase(), searchValue);
        }
        if (!allClientsMode) {
            const user = await getCurrentUser();
            if (user !== APILoadError) {
                urlParams.append("created_by_user", String(user.id));
            }
        }

        const zones = await getZones();
        const resp = await apiFetch(Endpoint.CLIENTS, "?" + urlParams.toString());
        const responseRows: IClientSummary[] = await resp.json();
        const rows: RowsProp = responseRows.map((responseRow) => {
            return {
                id: responseRow.id,
                name: responseRow.full_name,
                zone: zones.get(responseRow.zone) ?? "",
                [RiskType.HEALTH]: responseRow.health_risk_level,
                [RiskType.EDUCATION]: responseRow.educat_risk_level,
                [RiskType.SOCIAL]: responseRow.social_risk_level,
            };
        });

        setRows(rows);
    } catch (e) {
        setRows([]);
    }

    setLoading(false);
};

export default requestClientRows;
