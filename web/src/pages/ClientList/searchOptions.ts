import { TFunction } from "i18next";

export enum SearchOption {
    NAME = "Name",
    ZONE = "Zone",
}

export const getClientListSearchOptions = (t: TFunction) => ({
    NAME: { value: "NAME", display: t("general.name") },
    ZONE: { value: "ZONE", display: t("general.zone") },
});
