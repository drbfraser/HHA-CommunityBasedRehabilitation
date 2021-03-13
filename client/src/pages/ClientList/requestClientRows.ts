import { RowsProp } from "@material-ui/data-grid";
import { getCurrentUserId, getZoneMap } from "util/cache";
import { apiFetch, Endpoint } from "util/endpoints";
import { RiskType } from "util/risks";
import { SearchOption } from "./searchOptions";

enum RiskTypeAPIColumn {
    HEALTH = "health_risk_level",
    EDUCATION = "educat_risk_level",
    SOCIAL = "social_risk_level",
}

interface IResponseRow {
    id: number;
    full_name: string;
    zone: number;
    [RiskTypeAPIColumn.HEALTH]: string;
    [RiskTypeAPIColumn.EDUCATION]: string;
    [RiskTypeAPIColumn.SOCIAL]: string;
}

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
        const userId = getCurrentUserId();
        const urlParams = new URLSearchParams();

        if (searchValue) {
            urlParams.append(searchOption.toLowerCase(), searchValue);
        }
        if (!allClientsMode) {
            urlParams.append("created_by_user", await userId);
        }

        const resp = await apiFetch(Endpoint.CLIENTS, "?" + urlParams.toString());
        const responseRows: IResponseRow[] = await resp.json();
        const zoneMap = await getZoneMap();
        const rows: RowsProp = responseRows.map((responseRow) => {
            return {
                id: responseRow.id,
                name: responseRow.full_name,
                zone: zoneMap.get(responseRow.zone) ?? "",
                [RiskType.HEALTH]: responseRow[RiskTypeAPIColumn.HEALTH],
                [RiskType.EDUCATION]: responseRow[RiskTypeAPIColumn.EDUCATION],
                [RiskType.SOCIAL]: responseRow[RiskTypeAPIColumn.SOCIAL],
            };
        });

        setRows(rows);
    } catch (e) {
        setRows([]);
    }

    setLoading(false);
};

export default requestClientRows;
