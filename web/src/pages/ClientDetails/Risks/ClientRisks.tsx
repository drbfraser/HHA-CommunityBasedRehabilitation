import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Card, CardActions, CardContent, Typography, Button } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { IRisk } from "@cbr/common/util/risks";
import { IClient } from "@cbr/common/util/clients";
import { useStyles } from "./ClientRisks.styles";
import { getTranslatedRiskName, riskTypes } from "util/risks";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import ClientRisksModal from "./ClientRisksModal";

interface IProps {
    clientInfo?: IClient;
}

const ClientRisks = ({ clientInfo }: IProps) => {
    const styles = useStyles();
    const { t } = useTranslation();

    interface ICardProps {
        risk: IRisk;
    }
    const RiskCard = (props: ICardProps) => {
        const [risk, setRisk] = useState(props.risk);
        const [isModalOpen, setIsModalOpen] = useState(false);

        return (
            <>
                {isModalOpen && (
                    <ClientRisksModal
                        risk={risk}
                        setRisk={setRisk}
                        close={() => setIsModalOpen(false)}
                    />
                )}

                <Card variant="outlined">
                    <CardContent>
                        <Grid container direction="row" justify="space-between">
                            <Grid item md={6}>
                                <Typography variant="h5" component="h1">
                                    {getTranslatedRiskName(t, risk.risk_type)}
                                </Typography>
                            </Grid>
                            <Grid item md={6}>
                                <div className={styles.riskCardButtonAndBadge}>
                                    <RiskLevelChip risk={risk.risk_level} />
                                </div>
                            </Grid>
                        </Grid>
                        <br />

                        <Typography variant="subtitle2" component="h6">
                            {t("risks.requirements")}:
                        </Typography>
                        <Typography variant="body2" component="p">
                            {risk.requirement}
                        </Typography>
                        <br />

                        <Typography variant="subtitle2" component="h6">
                            {t("risks.goals")}:
                        </Typography>
                        <Typography variant="body2" component="p">
                            {risk.goal}
                        </Typography>
                    </CardContent>

                    <CardActions className={styles.riskCardButtonAndBadge}>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            disabled={!clientInfo?.is_active}
                            onClick={() => {
                                setIsModalOpen(true);
                            }}
                        >
                            {t("general.update")}
                        </Button>
                    </CardActions>
                </Card>
            </>
        );
    };

    return (
        <div className={styles.riskCardContainer}>
            <Grid container spacing={5} direction="row" justify="flex-start">
                {Object.keys(riskTypes).map((type) => {
                    const risk = clientInfo?.risks.find((r) => r.risk_type === type);
                    return (
                        <Grid item md={4} xs={12} key={type}>
                            {risk ? (
                                <RiskCard risk={risk} />
                            ) : (
                                <Skeleton variant="rect" height={300} />
                            )}
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
};

export default ClientRisks;
