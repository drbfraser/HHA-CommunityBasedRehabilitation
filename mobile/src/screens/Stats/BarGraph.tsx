import React from "react";
import {
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryContainer,
    VictoryGroup,
    VictoryLegend,
    VictoryTheme,
} from "victory-native";
import { BarGraphData, LegendColours } from "./Stats";

export type BarStat = {
    name: string;
    count: number;
};

type IProps = {
    barData: BarGraphData[];
    onBarPress?: (name: string) => void;
    legend?: LegendColours[];
};

const BarGraph = (graphProps: IProps) => {
    return (
        <VictoryChart
            animate={{ duration: 500 }}
            domainPadding={10}
            padding={{ left: 100, right: 50, bottom: 30, top: 30 }}
            containerComponent={<VictoryContainer />}
            theme={VictoryTheme.material}
        >
            {graphProps.legend && (
                <VictoryLegend
                    x={300}
                    y={0}
                    gutter={50}
                    style={{ title: { fontSize: 20 } }}
                    data={graphProps.legend}
                />
            )}
            <VictoryAxis
                style={{
                    axisLabel: { fontSize: 12 },
                    tickLabels: {
                        fontSize: 12,
                    },
                    grid: { stroke: "#B3E5FC", strokeWidth: 0.25 },
                }}
                dependentAxis
            />
            <VictoryAxis
                style={{
                    axisLabel: { fontSize: 10 },
                    tickLabels: {
                        fontSize: 10,
                    },
                }}
            />
            <VictoryGroup offset={10} colorScale={"qualitative"}>
                {graphProps.barData.map((item) => {
                    return (
                        <VictoryBar
                            horizontal
                            barRatio={0.8}
                            style={{ data: { fill: item.colour } }}
                            alignment="middle"
                            data={item.data}
                            key={item.key}
                            events={[
                                {
                                    target: "data",
                                    eventHandlers: {
                                        onPressIn: () => {
                                            return [
                                                {
                                                    target: "data",
                                                    mutation: (props) => {
                                                        if (graphProps.onBarPress) {
                                                            graphProps.onBarPress(props.datum.name);
                                                        }
                                                    },
                                                },
                                            ];
                                        },
                                    },
                                },
                            ]}
                            x="name"
                            y="count"
                        />
                    );
                })}
            </VictoryGroup>
        </VictoryChart>
    );
};

export default BarGraph;
