import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Grid,
    Card,
    CardActions,
    CardContent,
    Typography,
    Button,
    Box,
    Skeleton,
} from "@mui/material";

import { IRisk } from "@cbr/common/util/risks";
import { IClient } from "@cbr/common/util/clients";
import { clientRiskStyles } from "./ClientRisks.styles";
import { getTranslatedRiskName, riskTypes } from "util/risks";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import ClientRisksModal from "./ClientRisksModal";
import { OutcomeGoalMet } from "@cbr/common/util/visits";

interface IProps {
    clientInfo?: IClient;
    refreshClient?: () => void;
}

const ClientRisks = ({ clientInfo, refreshClient }: IProps) => {
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
                        setRisk={(newRisk) => {
                            setRisk(newRisk);
                            refreshClient?.();
                        }}
                        close={() => setIsModalOpen(false)}
                        newGoal={risk.goal_status !== OutcomeGoalMet.ONGOING}
                    />
                )}

                <Card variant="outlined">
                    <CardContent>
                        <Grid container direction="row" justifyContent="space-between">
                            <Grid item md={6}>
                                <Typography variant="h5" component="h1">
                                    {getTranslatedRiskName(t, risk.risk_type)}
                                </Typography>
                            </Grid>
                            <Grid item md={6}>
                                {risk.goal_status === OutcomeGoalMet.ONGOING ? (
                                    <Box sx={clientRiskStyles.riskCardButtonAndBadge}>
                                        <RiskLevelChip risk={risk.risk_level} />
                                    </Box>
                                ) : (
                                    ""
                                )}
                            </Grid>
                        </Grid>
                        <br />

                        {risk.goal_status === OutcomeGoalMet.ONGOING ? (
                            <>
                                <Typography variant="subtitle2" component="h6">
                                    Current Goal
                                </Typography>
                                <Typography variant="body2" component="p">
                                    {risk.goal_name}
                                </Typography>
                            </>
                        ) : (
                            <>
                            <Typography variant="subtitle2" component="h6">
                                    Current Goal
                            </Typography>
                            <Typography variant="body2" component="p">
                                No current goal set
                            </Typography>
                            </>
                        )}
                    </CardContent>

                    <CardActions sx={clientRiskStyles.riskCardButtonAndBadge}>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            disabled={!clientInfo?.is_active}
                            onClick={() => {
                                setIsModalOpen(true);
                            }}
                        >
                            {risk.goal_status === OutcomeGoalMet.ONGOING
                                ? t("general.update")
                                : "Create New Goal"}
                        </Button>
                    </CardActions>
                </Card>
            </>
        );
    };

    return (
        <Box sx={clientRiskStyles.riskCardContainer}>
            <Grid container spacing={5} direction="row" justifyContent="flex-start">
                {Object.keys(riskTypes).map((type) => {
                    const matchingRisks = clientInfo?.risks
                        .filter((r) => r.risk_type === type)
                        .sort((a, b) => b.timestamp - a.timestamp);

                    const risk = matchingRisks?.[0];
                    return (
                        <Grid item md={4} xs={12} key={type}>
                            {risk ? (
                                <RiskCard risk={risk} />
                            ) : (
                                <Skeleton variant="rectangular" height={300} />
                            )}
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default ClientRisks;
