import { Card, CardContent } from "@mui/material";
import React from "react";
import { dataCardStyles } from "./DataCard.styles";

interface IDataCardProps {
    data: {
        title: string;
        desc: string;
    }[];
}

const DataCard = ({ data }: IDataCardProps) => {

    return (
        <Card sx={dataCardStyles.container}>
            <CardContent>
                {data.map((d, i) => (
                    <p key={i}>
                        <b>{d.title}:</b> {d.desc}
                    </p>
                ))}
            </CardContent>
        </Card>
    );
};

export default DataCard;
