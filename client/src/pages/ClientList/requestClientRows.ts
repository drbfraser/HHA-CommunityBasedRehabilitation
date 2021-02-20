import { RowsProp } from "@material-ui/data-grid";
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
    searchField: string,
    searchOption: string
) => {
    setLoading(true);

    // TODO: remove when backend will accept just one parameter for name
    if (searchOption === SearchOption.NAME) {
        searchOption = "first_name";
    }

    let urlParams: string =
        searchField !== "" ? `?${searchOption.toLowerCase()}=${searchField}` : "";

    apiFetch(Endpoint.CLIENTS, urlParams)
        .then(async (response: Response) => {
            const responseRows: IResponseRow[] = await response.json();
            const rows: RowsProp = responseRows.map((responseRow) => {
                return {
                    id: responseRow.id,
                    name: responseRow.first_name + " " + responseRow.last_name,
                    zone: responseRow.zone,
                    [RiskCategory.HEALTH]: riskOptions[responseRow[RiskCategory.HEALTH]],
                    [RiskCategory.EDUCATION]: riskOptions[responseRow[RiskCategory.EDUCATION]],
                    [RiskCategory.SOCIAL]: riskOptions[responseRow[RiskCategory.SOCIAL]],
                };
            });

            console.log(urlParams);
            console.log(rows);

            setRows(rows);
        })
        .catch(() => setRows([]))
        .finally(() => setLoading(false));
};

export default requestClientRows;
