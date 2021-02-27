import { makeStyles } from "@material-ui/core/styles";
import { mediaMobile } from "theme.styles";
import { riskLevels } from "util/risks";

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
        timeline: {
            [mediaMobile]: {
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
        timelineEntry: {
            margin: 10,
            marginRight: 0,
            padding: 10,
            border: "1px solid #aaa",
            borderRadius: 5,
            fontSize: "120%",
        },
        riskEntry: {
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#eee",
            },
        },
        timelineDate: {
            alignSelf: "center",
            flex: 0,
            paddingLeft: 0,
            whiteSpace: "nowrap",
        },
        hidden: {
            visibility: "hidden",
        },
        textCenter: {
            textAlign: "center",
        },
        chartContainer: chartContainer,
    },
    { index: 1 }
);
