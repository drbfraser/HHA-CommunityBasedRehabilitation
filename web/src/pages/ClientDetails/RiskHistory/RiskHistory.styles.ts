import { riskLevels } from "@cbr/common/util/risks";
import { SxProps, Theme } from '@mui/material';

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

// todosd: correct?  this is a hack, do this better...
// https://stackoverflow.com/questions/63771649/react-convert-cssproperties-to-styled-component
const regex = new RegExp(/[A-Z]/g)
const kebabCase = (str: string) => str.replace(regex, v => `-${v.toLowerCase()}`)
export const chartContainerStyles = Object.keys(chartContainer).reduce((accumulator, key) => {
    // transform the key from camelCase to kebab-case
    const cssKey = kebabCase(key)
    
    // remove ' in value
    const cssValue = (chartContainer[key] as string).replace("'", "")
    // build the result
    // you can break the line, add indent for it if you need
    return `${accumulator}${cssKey}:${cssValue};`
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
}

// todosd: remove
// export const useStyles = makeStyles(
//     {
//         textCenter: {
//             textAlign: "center",
//         },
//         chartContainer: chartContainer,
//         chartSkeleton: {
//             width: "90% !important",
//             margin: "0 auto",
//         },
//     },
//     { index: 1 }
// );
