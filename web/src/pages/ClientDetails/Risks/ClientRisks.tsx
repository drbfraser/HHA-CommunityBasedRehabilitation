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

interface IProps {
    clientInfo?: IClient;
}

const ClientRisks = ({ clientInfo }: IProps) => {
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
                        <Grid container direction="row" justifyContent="space-between">
                            <Grid item md={6}>
                                <Typography variant="h5" component="h1">
                                    {getTranslatedRiskName(t, risk.risk_type)}
                                </Typography>
                            </Grid>
                            <Grid item md={6}>
                                <Box sx={clientRiskStyles.riskCardButtonAndBadge}>
                                    <RiskLevelChip risk={risk.risk_level} />
                                </Box>
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
                            {t("general.update")}
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
                    const risk = clientInfo?.risks.find((r) => r.risk_type === type);
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
