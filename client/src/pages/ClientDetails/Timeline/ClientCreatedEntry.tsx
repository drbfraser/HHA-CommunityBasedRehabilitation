import React from "react";
import TimelineEntry from "./TimelineEntry";

interface IProps {
    createdDate: string;
}

const ClientCreatedEntry = ({ createdDate }: IProps) => (
    <TimelineEntry date={createdDate} content="Client Created" bottomEntry={true} />
);

export default ClientCreatedEntry;
