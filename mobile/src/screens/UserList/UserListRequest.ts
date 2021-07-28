import {
    apiFetch,
    Endpoint,
    getZones,
    SearchOption,
    IUser,
    UserRole,
    userRoles,
} from "@cbr/common";

export type userBrife = {
    id: number;
    full_name: string;
    zoneID: number;
    zone: string;
    role: string;
    status: string;
};

export const fetchUsersFromApi = async (
    searchOption,
    searchValue: string,
    sortOption,
    sortDirection
): Promise<userBrife[]> => {
    try {
        const urlParams = new URLSearchParams();

        const zones = await getZones();
        const resp = await apiFetch(Endpoint.USERS, "?" + urlParams.toString());
        const responseRows: IUser[] = await resp.json();

        var resultRow = responseRows.map((responseRow: IUser) => ({
            id: responseRow.id,
            full_name: responseRow.first_name + " " + responseRow.last_name,
            zoneID: responseRow.zone,
            zone: zones.get(responseRow.zone) ?? "",
            role: userRoles[responseRow.role].name,
            status: responseRow.is_active ? "Active" : "Disabled",
        }));
        if (searchValue.length != 0) {
            if (searchOption == SearchOption.ID) {
                resultRow = resultRow.filter((item) => {
                    return String(item.id) == searchValue;
                });
            } else if (searchOption == SearchOption.NAME) {
                resultRow = resultRow.filter((item) => {
                    return item.full_name.includes(searchValue);
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
