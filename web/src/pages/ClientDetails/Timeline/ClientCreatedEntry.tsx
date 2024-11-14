import React from "react";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import TimelineEntry from "./TimelineEntry";

interface IProps {
    createdDate: string;
}

const ClientCreatedEntry = ({ createdDate }: IProps) => {
    const { t } = useTranslation();

    return (
        <TimelineEntry
            date={createdDate}
            content={t("clientAttr.clientCreated")}
            DotIcon={AddIcon}
            isBottomEntry={true}
        />
    );
};

export default ClientCreatedEntry;
