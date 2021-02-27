import React from "react";
import { useStyles } from "./RiskHistory.styles";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { IRisk, RiskLevel, riskLevels, RiskType, riskTypes } from "util/risks";
import { Grid, Typography } from "@material-ui/core";

interface IProps {
    risks: IRisk[];
    dateFormatter: (timestamp: number) => string;
}

interface IChartData {
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

    const dataObj: IChartData = {
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
                timestamp: Date.now() / 1000,
                level: riskArray[riskArray.length - 1].level,
            });
        }
    });

    return dataObj;
};

const RiskHistoryCharts = ({ risks, dateFormatter }: IProps) => {
    const styles = useStyles();
    const allData = risksToChartData(risks.slice());

    const RiskChart = ({ riskType }: { riskType: RiskType }) => (
        <ResponsiveContainer width="100%" height={300} className={styles.chartContainer}>
            <LineChart>
                <CartesianGrid strokeDasharray="6" vertical={false} />
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
                    padding={{
                        top: 25,
                        bottom: 25,
                    }}
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
                    strokeWidth={6}
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
