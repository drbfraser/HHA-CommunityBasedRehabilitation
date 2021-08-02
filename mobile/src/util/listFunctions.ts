import { themeColors } from "@cbr/common";
import { ClientListRow } from "../screens/ClientList/ClientListRequest";
import { BriefReferral } from "../screens/DashBoard/DashboardRequest";
import BriefUser from "../screens/UserList/UserListRequest";

export enum SortOptions {
    ID = "id",
    NAME = "name",
    ZONE = "zone",
    HEALTH = "health",
    EDUCATION = "education",
    SOCIAL = "social",
    TYPE = "type",
    DATE = "date",
    STATUS = "status",
    ROLE = "role",
}

//Use to prevent the default return value of map object that will cause syntax error.
const getNextDirection = (currentDirection: TSortDirection): TSortDirection => {
    const next = circularDirection.get(currentDirection);
    if (next === undefined) {
        return "None";
    } else {
        return next;
    }
};

export const circularDirection = new Map<TSortDirection, TSortDirection>([
    ["ascending", "descending"],
    ["descending", "None"],
    ["None", "ascending"],
]);

export type TSortDirection = "ascending" | "descending" | "None";

export const sortBy = async (
    option: string,
    sortOption: string,
    sortDirection: TSortDirection,
    setSortOption: React.Dispatch<React.SetStateAction<string>>,
    setSortDirection: React.Dispatch<React.SetStateAction<TSortDirection>>
) => {
    if (option != sortOption) {
        setSortOption(option);
        setSortDirection("ascending");
    } else {
        setSortDirection(getNextDirection(sortDirection));
    }
};

export const arrowDirectionController = (
    column_name: string,
    sortOption: string,
    sortDirection: TSortDirection
): "ascending" | "descending" | undefined => {
    if (column_name === sortOption) {
        switch (sortDirection) {
            case "ascending": {
                return "ascending";
            }
            case "descending": {
                return "descending";
            }
            case "None": {
                return undefined;
            }
        }
    }

    return undefined;
};
const mapColorWithLevel = new Map([
    [themeColors.riskGreen, 0],
    [themeColors.riskYellow, 1],
    [themeColors.riskRed, 4],
    [themeColors.riskBlack, 13],
]);

export const getLevelByColor = (color: string) => {
    return mapColorWithLevel.get(color) || 0;
};

export const clientComparator = (
    a: ClientListRow,
    b: ClientListRow,
    sortOption: string,
    sortDirection: string
): number => {
    let result = 0;
    switch (sortOption) {
        case SortOptions.ID: {
            result = a.id - b.id;
            break;
        }
        case SortOptions.NAME: {
            result = a.full_name > b.full_name ? 1 : -1;
            break;
        }
        case SortOptions.ZONE: {
            result = a.zone > b.zone ? 1 : -1;
            break;
        }
        case SortOptions.HEALTH: {
            result = getLevelByColor(a.HealthLevel) > getLevelByColor(b.HealthLevel) ? 1 : -1;
            break;
        }
        case SortOptions.EDUCATION: {
            result = getLevelByColor(a.EducationLevel) > getLevelByColor(b.EducationLevel) ? 1 : -1;
            break;
        }
        case SortOptions.SOCIAL: {
            result = getLevelByColor(a.SocialLevel) > getLevelByColor(b.SocialLevel) ? 1 : -1;
            break;
        }
        case SortOptions.DATE: {
            result = a.last_visit_date > b.last_visit_date ? 1 : -1;
            break;
        }
    }
    return sortDirection === "ascending" ? result : -1 * result;
};

export const referralComparator = (
    a: BriefReferral,
    b: BriefReferral,
    referralSortOption: string,
    referralSortDirection: string
): number => {
    let result = 0;
    switch (referralSortOption) {
        case SortOptions.NAME: {
            result = a.full_name > b.full_name ? 1 : -1;
            break;
        }
        case SortOptions.TYPE: {
            result = a.type > b.type ? 1 : -1;
            break;
        }
        case SortOptions.DATE: {
            result = a.date_referred > b.date_referred ? 1 : -1;
            break;
        }
    }
    return referralSortDirection === "ascending" ? result : -1 * result;
};

export const userComparator = (
    a: BriefUser,
    b: BriefUser,
    sortOption: string,
    sortDirection: string
): number => {
    let result = 0;
    switch (sortOption) {
        case SortOptions.ID: {
            result = a.id - b.id;
            break;
        }
        case SortOptions.NAME: {
            result = a.full_name > b.full_name ? 1 : -1;
            break;
        }
        case SortOptions.ZONE: {
            result = a.zone > b.zone ? 1 : -1;
            break;
        }
        case SortOptions.ROLE: {
            result = a.role > b.role ? 1 : -1;
            break;
        }
        case SortOptions.STATUS: {
            result = a.status > b.status ? 1 : -1;
            break;
        }
        default: {
            break;
        }
    }
    return sortDirection === "ascending" ? result : -1 * result;
};
