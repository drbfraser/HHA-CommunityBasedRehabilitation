import { makeStyles } from "@material-ui/core/styles";
import { riskLevels } from "@cbr/common/util/risks";

// remove all lines from the cartesian grid
const chartContainer: { [key: string]: React.CSSProperties } = {
    "& .recharts-cartesian-grid-horizontal line": {
        strokeOpacity: 0,
    },
};

// then show the ones we want and set the colors to the risk level colors
Object.values(riskLevels).forEach(({ color }, i) => {
    chartContainer[`& .recharts-cartesian-grid-horizontal line:nth-child(${i + 1})`] = {
        strokeOpacity: 1,
        stroke: color,
    };
});

export const useStyles = makeStyles(
    {
        textCenter: {
            textAlign: "center",
        },
        chartContainer: chartContainer,
        chartSkeleton: {
            width: "90% !important",
            margin: "0 auto",
        },
    },
    { index: 1 }
);
