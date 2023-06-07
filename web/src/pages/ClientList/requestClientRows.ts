import { RowsProp } from "@material-ui/data-grid";
import { IClientSummary } from "@cbr/common/util/clients";
import { apiFetch, APILoadError, Endpoint } from "@cbr/common/util/endpoints";
import { getCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { getZones } from "@cbr/common/util/hooks/zones";
import { RiskType } from "@cbr/common/util/risks";
import { SearchOption } from "./searchOptions";

const requestClientRows = async (
    setRows: (rows: RowsProp) => void,
    setLoading: (loading: boolean) => void,
    searchValue: string,
    searchOption: string,
    allClientsMode: boolean,
    archivedMode: boolean
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
                urlParams.append("user_id", String(user.id));
            }
        }
        if (!archivedMode) {
            urlParams.append("is_active", String(true));
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
                [RiskType.NUTRITION]: responseRow.nutrit_risk_level,
                [RiskType.MENTAL]: responseRow.mental_risk_level,
                is_active: responseRow.is_active,
            };
        });

        setRows(rows);
    } catch (e) {
        setRows([]);
    }

    setLoading(false);
};

export default requestClientRows;
