import { riskLevels } from "@cbr/common/util/risks";
import { SxProps, Theme } from "@mui/material";

// remove all lines from the cartesian grid
const chartContainer: { [key: string]: React.CSSProperties } = {
    "& .recharts-cartesian-grid-horizontal line": {
        strokeOpacity: 0,
    },
};

// then show the ones we want and set the colors to the risk level colors
Object.values(riskLevels).forEach(({ color }, i) => {
    chartContainer[`& .recharts-cartesian-grid-horizontal line:nth-of-type(${i + 1})`] = {
        strokeOpacity: 1,
        stroke: color,
    };
});

export const riskHistoryStyles: Record<string, SxProps<Theme>> = {
    textCenter: {
        textAlign: "center",
    },
    chartContainer: chartContainer,
    chartSkeleton: {
        width: "90% !important",
        margin: "0 auto",
    },
};
