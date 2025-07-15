import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
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
import { getDateFormatterFromReference } from "@cbr/common/util/dates";
import { IClient } from "@cbr/common/util/clients";
import { getTranslatedRiskChartName } from "util/risks";
import { riskHistoryStyles } from "./RiskHistory.styles";
import { OutcomeGoalMet } from "@cbr/common/util/visits";

interface IProps {
    client?: IClient;
}

interface IChartData {
    [RiskType.HEALTH]: IDataPoint[];
    [RiskType.EDUCATION]: IDataPoint[];
    [RiskType.SOCIAL]: IDataPoint[];
    [RiskType.NUTRITION]: IDataPoint[];
    [RiskType.MENTAL]: IDataPoint[];
}

interface IDataPoint {
    timestamp: number;
    level: RiskLevel;
    goal_status: OutcomeGoalMet;
}

const risksToChartData = (risks: IRisk[]) => {
    const dataObj: IChartData = {
        [RiskType.HEALTH]: [],
        [RiskType.EDUCATION]: [],
        [RiskType.SOCIAL]: [],
        [RiskType.NUTRITION]: [],
        [RiskType.MENTAL]: [],
    };

    // sort risks by timestamp
    risks.sort((a, b) => a.timestamp - b.timestamp);

    // populate chart data
    risks.forEach((risk) => {
        const array = dataObj[risk.risk_type];
        array.push({
            timestamp: risk.timestamp,
            level: risk.risk_level,
            goal_status: risk.goal_status,
        });
    });

    // add point for each risk type at today
    Object.keys(dataObj).forEach((key) => {
        const riskType = key as RiskType;
        const array = dataObj[riskType];

        if (array.length > 0) {
            array.push({
                timestamp: Date.now(),
                level: array[array.length - 1].level,
                goal_status: array[array.length - 1].goal_status
            });
        }
    });

    return dataObj;
};


const RiskHistoryCharts = ({ client }: IProps) => {
    const [chartData, setChartData] = useState<IChartData>();
    const { t } = useTranslation();
    const chartHeight = 300;

    useEffect(() => {
        if (client) {
            setChartData(risksToChartData(client.risks.slice()));
        }
    }, [client]);

    const RiskChart = ({ riskType, data }: { riskType: RiskType; data: IDataPoint[] }) => {
        const dateFormatter = getDateFormatterFromReference(client?.created_at);

        const segments: IDataPoint[][] = [];
        let currentSegment: IDataPoint[] = [];

        for (let i = 0; i < data.length; i++) {
            const risk = data[i];

            if (risk.goal_status === OutcomeGoalMet.ONGOING) {
                currentSegment.push(risk);
            } else {
                // push point on end (concluded/cancelled)
                if (currentSegment.length > 0) {
                    currentSegment.push(risk);
                    segments.push([...currentSegment]);
                    currentSegment = [];
                }
            }
        }

        // end case if current goal still ongoing
        if (currentSegment.length > 0) {
            segments.push(currentSegment);
        }

        return (
            <Box sx={riskHistoryStyles.chartContainer}>
                <ResponsiveContainer width="100%" height={chartHeight}>
                    <LineChart>
                        <CartesianGrid strokeDasharray="6" vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            type="number"
                            domain={[
                                data[0].timestamp,
                                Date.now(),
                            ]}
                            tickFormatter={dateFormatter}
                        />
                        <YAxis
                            type="category"
                            domain={Object.keys(riskLevels)}
                            tickFormatter={(level) => riskLevels[level].name}
                            padding={{ top: 25, bottom: 25 }}
                        />
                        <Tooltip
                            labelFormatter={dateFormatter}
                            formatter={(level: RiskLevel) => riskLevels[level].name}
                        />
                        {segments.map((segment, index) => (
                            <Line
                                key={index}
                                type="stepAfter"
                                name={getTranslatedRiskChartName(t, riskType)}
                                data={segment}
                                dataKey="level"
                                stroke={riskLevels[segment[segment.length - 1].level].color}
                                strokeWidth={6}
                                isAnimationActive={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        );
    };


    return (
        <Grid container>
            {[
                RiskType.HEALTH,
                RiskType.EDUCATION,
                RiskType.SOCIAL,
                RiskType.NUTRITION,
                RiskType.MENTAL,
            ].map((riskType) => (
                // TODO: REMOVE when working on visit
                //(riskType!==RiskType.NUTRITION) ?

                <Grid key={riskType} item md={4} xs={12}>
                    <Typography variant="h5" sx={riskHistoryStyles.textCenter}>
                        {getTranslatedRiskChartName(t, riskType)}
                    </Typography>
                    {chartData && chartData[riskType].length ? (
                        <RiskChart riskType={riskType} data={chartData[riskType]} />
                    ) : (
                        <Skeleton
                            variant="rectangular"
                            height={chartHeight}
                            sx={riskHistoryStyles.chartSkeleton}
                        />
                    )}
                </Grid>
                //:<></>
            ))}
        </Grid>
    );
};

export default RiskHistoryCharts;
