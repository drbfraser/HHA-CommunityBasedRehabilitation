import React from "react";
import { Skeleton } from "@material-ui/lab";
import TimelineEntry from "./TimelineEntry";

const SkeletonEntry = () => (
    <TimelineEntry date={<Skeleton variant="text" />} content={<Skeleton variant="text" />} />
);

export default SkeletonEntry;
