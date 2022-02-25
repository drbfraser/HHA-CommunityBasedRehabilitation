import React, { useEffect, useState } from "react";
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
import { IRisk, RiskLevel, riskLevels, RiskType } from "@cbr/common/util/risks";
import { riskTypes } from "util/riskIcon";
import { Grid, Typography } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { getDateFormatterFromReference } from "@cbr/common/util/dates";
import { IClient } from "@cbr/common/util/clients";

interface IProps {
    client?: IClient;
}

interface IChartData {
    [RiskType.HEALTH]: IDataPoint[];
    [RiskType.EDUCATION]: IDataPoint[];
    [RiskType.SOCIAL]: IDataPoint[];
    [RiskType.NUTRITION]: IDataPoint[];
}

interface IDataPoint {
    timestamp: number;
    level: RiskLevel;
}

const risksToChartData = (risks: IRisk[]) => {
    const dataObj: IChartData = {
        [RiskType.HEALTH]: [],
        [RiskType.EDUCATION]: [],
        [RiskType.SOCIAL]: [],
        [RiskType.NUTRITION]: [],
    };

    risks.sort((a, b) => a.timestamp - b.timestamp);

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
                timestamp: Date.now(),
                level: riskArray[riskArray.length - 1].level,
            });
        }
    });

    return dataObj;
};

const RiskHistoryCharts = ({ client }: IProps) => {
    const styles = useStyles();
    const chartHeight = 300;
    const [chartData, setChartData] = useState<IChartData>();
    const dateFormatter = getDateFormatterFromReference(client?.created_at);

    useEffect(() => {
        if (client) {
            setChartData(risksToChartData(client.risks.slice()));
        }
    }, [client]);

    const RiskChart = ({ riskType, data }: { riskType: RiskType; data: IDataPoint[] }) => (
        <ResponsiveContainer width="100%" height={chartHeight} className={styles.chartContainer}>
            <LineChart>
                <CartesianGrid strokeDasharray="6" vertical={false} />
                <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={[data[0].timestamp, data.slice(-1)[0].timestamp]}
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
                    type="stepAfter"
                    name={`${riskTypes[riskType].name} Risk`}
                    data={data}
                    dataKey="level"
                    stroke={riskLevels[data.slice(-1)[0].level].color}
                    strokeWidth={6}
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

                    {chartData && chartData[riskType].length ? (
                        <RiskChart riskType={riskType} data={chartData[riskType]} />
                    ) : (
                        <Skeleton
                            variant="rect"
                            height={chartHeight}
                            className={styles.chartSkeleton}
                        />
                    )}
                </Grid>
            ))}
        </Grid>
    );
};

export default RiskHistoryCharts;
