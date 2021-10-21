import React from "react";
import TimelineEntry from "./TimelineEntry";
import AddIcon from "@material-ui/icons/Add";

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
