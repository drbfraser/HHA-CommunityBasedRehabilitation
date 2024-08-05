import {
    apiFetch,
    Endpoint,
    getZones,
    SearchOption,
    IUser,
    UserRole,
    userRoles,
} from "@cbr/common";
import { modelName } from "../../models/constant";
import { dbType } from "../../util/watermelonDatabase";
import i18n from "i18next";

type BriefUser = {
    id: string;
    full_name: string;
    zoneID: number;
    zone: string;
    role: string;
    status: string;
};
export default BriefUser;

export const fetchUsersFromDB = async (
    searchOption,
    searchValue: string,
    sortOption,
    sortDirection,
    database: dbType
): Promise<BriefUser[]> => {
    try {
        const FIRST_NAME = 0;
        const LAST_NAME = 1;

        const urlParams = new URLSearchParams();

        const zones = await getZones();
        const responseRows: any = await database.get(modelName.users).query();
        var resultRow = responseRows.map((responseRow: IUser) => ({
            id: responseRow.id,
            full_name: responseRow.first_name + " " + responseRow.last_name,
            zoneID: responseRow.zone,
            zone: zones.get(responseRow.zone) ?? "",
            role: userRoles[responseRow.role].name,
            status: responseRow.is_active ? 
                i18n.t("general.active")
                : i18n.t("general.disabled")
        }));
        if (searchValue.length != 0) {
            if (searchOption == SearchOption.NAME) {
                resultRow = resultRow.filter((item) => {
                    let splitFullName = item.full_name.split(" ");

                    return (
                        splitFullName[FIRST_NAME].toLowerCase().match(searchValue.toLowerCase()) ||
                        splitFullName[LAST_NAME].toLowerCase().match(searchValue.toLowerCase())
                    );
                });
            } else if (searchOption == SearchOption.ZONE) {
                resultRow = resultRow.filter((item) => {
                    return item.zone.includes(searchValue);
                });
            }
        }
        return resultRow;
    } catch (e) {
        return [];
    }
};
