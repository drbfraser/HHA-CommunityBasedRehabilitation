import { RowsProp } from "@material-ui/data-grid";
import { getZoneMap } from "util/cache";
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
    searchOption: string
) => {
    setLoading(true);

    searchValue = searchValue.trim();

    if (searchOption === SearchOption.NAME) {
        searchOption = "full_name";
    }

    let urlParams: string =
        searchValue !== "" ? `?${searchOption.toLowerCase()}=${searchValue}` : "";

    try {
        const resp = await apiFetch(Endpoint.CLIENTS, urlParams);

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
