import { RowsProp } from "@material-ui/data-grid";
import { getZoneMap } from "util/cache";
import { apiFetch, Endpoint } from "util/endpoints";
import { RiskCategory, riskOptions } from "util/riskOptions";
import { SearchOption } from "./searchOptions";

interface IResponseRow {
    id: number;
    full_name: string;
    zone: number;
    [RiskCategory.HEALTH]: string;
    [RiskCategory.SOCIAL]: string;
    [RiskCategory.EDUCATION]: string;
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
                [RiskCategory.HEALTH]: riskOptions[responseRow[RiskCategory.HEALTH]],
                [RiskCategory.EDUCATION]: riskOptions[responseRow[RiskCategory.EDUCATION]],
                [RiskCategory.SOCIAL]: riskOptions[responseRow[RiskCategory.SOCIAL]],
            };
        });

        setRows(rows);
    } catch (e) {
        setRows([]);
    }

    setLoading(false);
};

export default requestClientRows;
