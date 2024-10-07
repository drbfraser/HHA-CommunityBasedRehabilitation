import React from "react";
import TimelineEntry from "./TimelineEntry";
import AddIcon from "@mui/icons-material/Add";

interface IProps {
    createdDate: string;
}

const ClientCreatedEntry = ({ createdDate }: IProps) => (
    <TimelineEntry
        date={createdDate}
        content="Client Created"
        DotIcon={AddIcon}
        isBottomEntry={true}
    />
);

export default ClientCreatedEntry;
