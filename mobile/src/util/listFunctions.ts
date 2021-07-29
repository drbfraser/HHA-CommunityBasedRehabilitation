import { themeColors } from "@cbr/common";
import { ClientTest } from "../screens/ClientList/ClientListRequest";
import { BrifeReferral } from "../screens/DashBoard/DashboardRequest";
import { userBrife } from "../screens/UserList/UserListRequest";

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

export const sortDirections = ["asc", "dec", "None"];

export const sortBy = async (
    option: string,
    sortOption: string,
    setSortOption,
    currentDirection,
    setCurrentDirection,
    setIsSortDirection
) => {
    if (option != sortOption) {
        setSortOption(option);
        setCurrentDirection(0);
        setIsSortDirection(sortDirections[currentDirection]);
    } else {
        setCurrentDirection(currentDirection + 1);
        if (currentDirection >= 2) {
            setCurrentDirection(0);
        }
        setIsSortDirection(sortDirections[currentDirection]);
    }
};

export const arrowDirectionController = (
    column_name: string,
    sortOption: string,
    sortDirection: string
) => {
    if (column_name === sortOption) {
        if (sortDirection === "asc") {
            return "ascending";
        } else if (sortDirection === "dec") {
            return "descending";
        } else {
            return undefined;
        }
    }
    return undefined;
};

export const getLevelByColor = (color: string) => {
    if (color === themeColors.riskYellow) {
        return 1;
    } else if (color === themeColors.riskRed) {
        return 4;
    } else if (color === themeColors.riskBlack) {
        return 13;
    }
    return 0;
};

export const theClientComparator = (
    a: ClientTest,
    b: ClientTest,
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
    }
    return sortDirection === "asc" ? result : -1 * result;
};

export const referralComparator = (
    a: BrifeReferral,
    b: BrifeReferral,
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
    return referralSortDirection === "asc" ? result : -1 * result;
};

export const userComparator = (
    a: userBrife,
    b: userBrife,
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
    return sortDirection === "asc" ? result : -1 * result;
};
