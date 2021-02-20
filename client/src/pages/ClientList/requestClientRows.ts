import { RowsProp } from "@material-ui/data-grid";
import { getZoneMap } from "util/cache";
import { apiFetch, Endpoint } from "util/endpoints";
import { RiskCategory, riskOptions } from "util/riskOptions";
import { SearchOption } from "./searchOptions";

interface IResponseRow {
    id: number;
    first_name: string;
    last_name: string;
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

    // TODO: remove when backend will accept just one parameter for name
    if (searchOption === SearchOption.NAME) {
        searchOption = "first_name";
    }

    let urlParams: string =
        searchValue !== "" ? `?${searchOption.toLowerCase()}=${searchValue}` : "";

    apiFetch(Endpoint.CLIENTS, urlParams)
        .then(async (response: Response) => {
            const responseRows: IResponseRow[] = await response.json();
            const zoneMap = await getZoneMap();
            const rows: RowsProp = responseRows.map((responseRow) => {
                return {
                    id: responseRow.id,
                    name: responseRow.first_name + " " + responseRow.last_name,
                    zone: zoneMap.get(responseRow.zone) ?? "",
                    [RiskCategory.HEALTH]: riskOptions[responseRow[RiskCategory.HEALTH]],
                    [RiskCategory.EDUCATION]: riskOptions[responseRow[RiskCategory.EDUCATION]],
                    [RiskCategory.SOCIAL]: riskOptions[responseRow[RiskCategory.SOCIAL]],
                };
            });

            setRows(rows);
        })
        .catch(() => setRows([]))
        .finally(() => setLoading(false));
};

export default requestClientRows;
