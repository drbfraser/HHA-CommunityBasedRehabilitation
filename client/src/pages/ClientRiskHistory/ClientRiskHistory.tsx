import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import { ArrowBack } from "@material-ui/icons";
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
} from "@material-ui/lab";
import Alert from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { IClient } from "util/clients";
import { apiFetch, Endpoint } from "util/endpoints";
import { IRisk } from "util/risks";
import { useStyles } from "./RiskHistory.styles";
import RiskHistoryEntry from "./RiskHistoryEntry";

interface IRouteParams {
    clientId: string;
}

enum ReqStatus {
    LOADING,
    LOADED,
    ERROR,
}

const ClientRiskHistory = () => {
    const styles = useStyles();
    const history = useHistory();
    const { clientId } = useRouteMatch<IRouteParams>().params;
    const [status, setStatus] = useState(ReqStatus.LOADING);
    const [client, setClient] = useState<IClient>();

    useEffect(() => {
        const riskSort = (a: IRisk, b: IRisk) => {
            if (a.timestamp === b.timestamp) {
                return b.risk_type.localeCompare(a.risk_type);
            }

            return b.timestamp - a.timestamp;
        };

        const getClient = async () => {
            try {
                const theClient: IClient = await (
                    await apiFetch(Endpoint.CLIENT, `${clientId}`)
                ).json();

                theClient.risks.sort(riskSort);

                setClient(theClient);
                setStatus(ReqStatus.LOADED);
            } catch (e) {
                setStatus(ReqStatus.ERROR);
            }
        };

        getClient();
    }, [clientId]);

    return (
        <>
            <Button onClick={history.goBack}>
                <ArrowBack /> Go back
            </Button>
            <br />
            <br />
            {status === ReqStatus.LOADING && <LinearProgress />}
            {status === ReqStatus.ERROR && (
                <Alert severity="error">Something went wrong. Please go back and try again.</Alert>
            )}
            {status === ReqStatus.LOADED && client && (
                <>
                    <Typography variant="h3">
                        Overview for {client.first_name} {client.last_name}
                    </Typography>
                    <Timeline>
                        {client.risks.map((risk) => (
                            <RiskHistoryEntry
                                key={risk.id}
                                risk={risk}
                                isInitial={risk.timestamp === client.created_date}
                            />
                        ))}
                        <TimelineItem>
                            <TimelineOppositeContent className={styles.timelineDate}>
                                {new Date(client.created_date * 1000).toLocaleDateString()}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot />
                                <TimelineConnector className={styles.hidden} />
                            </TimelineSeparator>
                            <TimelineContent>
                                <div className={styles.timelineEntry}>Client created</div>
                            </TimelineContent>
                        </TimelineItem>
                    </Timeline>
                </>
            )}
        </>
    );
};

export default ClientRiskHistory;
