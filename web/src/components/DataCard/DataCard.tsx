import { Card, CardContent } from "@material-ui/core";
import React from "react";
import { useStyles } from "./DataCard.styles";

interface IDataCardProps {
    data: {
        title: string;
        desc: string;
    }[];
}

const DataCard = ({ data }: IDataCardProps) => {
    const styles = useStyles();

    return (
        <Card className={styles.container}>
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
