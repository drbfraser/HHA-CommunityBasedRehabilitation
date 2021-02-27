import React from "react";
import { useStyles } from "./RiskHistory.styles";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { IRisk, RiskLevel, riskLevels, RiskType, riskTypes } from "util/risks";
import { Grid, Typography } from "@material-ui/core";

interface IProps {
    risks: IRisk[];
}

interface IChartData {
    minTimestamp: number;
    maxTimestamp: number;
    [RiskType.HEALTH]: IDataPoint[];
    [RiskType.EDUCATION]: IDataPoint[];
    [RiskType.SOCIAL]: IDataPoint[];
}

interface IDataPoint {
    timestamp: number;
    level: RiskLevel;
}

const risksToChartData = (risks: IRisk[]) => {
    risks.sort((a, b) => a.timestamp - b.timestamp);

    const currentTimestamp = Date.now() / 1000;
    const minTimestamp = risks.length ? risks[0].timestamp : currentTimestamp;

    const dataObj: IChartData = {
        minTimestamp: minTimestamp,
        maxTimestamp: currentTimestamp,
        [RiskType.HEALTH]: [],
        [RiskType.EDUCATION]: [],
        [RiskType.SOCIAL]: [],
    };

    risks.forEach((risk) => {
        dataObj[risk.risk_type].push({
            timestamp: risk.timestamp,
            level: risk.risk_level,
        });
    });

    // add data for the current time
    [RiskType.HEALTH, RiskType.EDUCATION, RiskType.SOCIAL].forEach((riskType) => {
        const riskArray = dataObj[riskType];

        if (riskArray.length) {
            riskArray.push({
                timestamp: currentTimestamp,
                level: riskArray[riskArray.length - 1].level,
            });
        }
    });

    return dataObj;
};

const RiskHistoryCharts = ({ risks }: IProps) => {
    const styles = useStyles();
    const allData = risksToChartData(risks.slice());

    const dateFormatter = (timestamp: number) => {
        const oneWeek = 60 * 60 * 24 * 7;
        const date = new Date(timestamp * 1000);
        const dataTimeSpan = allData.maxTimestamp - allData.minTimestamp;

        if (dataTimeSpan < oneWeek) {
            return date.toLocaleString([], {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
            });
        }

        return date.toLocaleDateString();
    };

    const RiskChart = ({ riskType }: { riskType: RiskType }) => (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <Legend />
                <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={["auto", "auto"]}
                    tickFormatter={dateFormatter}
                />
                <YAxis
                    type="category"
                    domain={Object.keys(riskLevels)}
                    tickFormatter={(level) => riskLevels[level].name}
                />
                <Tooltip
                    labelFormatter={dateFormatter}
                    formatter={(level: RiskLevel) => riskLevels[level].name}
                />
                <Line
                    type="linear"
                    name={`${riskTypes[riskType].name} Risk`}
                    data={allData[riskType]}
                    dataKey="level"
                    stroke={riskLevels[allData[riskType].slice(-1)[0].level].color}
                    strokeWidth={3}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );

    return (
        <Grid container>
            {[RiskType.HEALTH, RiskType.EDUCATION, RiskType.SOCIAL].map((riskType) => (
                <Grid key={riskType} item md={4} xs={12}>
                    <Typography variant="h5" className={styles.textCenter}>
                        {riskTypes[riskType].name} Risk
                    </Typography>
                    {allData[riskType].length ? (
                        <RiskChart riskType={riskType} />
                    ) : (
                        <p>No data available.</p>
                    )}
                </Grid>
            ))}
        </Grid>
    );
};

export default RiskHistoryCharts;
