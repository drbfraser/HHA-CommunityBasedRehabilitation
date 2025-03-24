import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import * as Yup from "yup";
import {
    Accordion,
    AccordionSummary,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogTitle,
    Typography,
} from "@mui/material";
import NearMeIcon from "@mui/icons-material/NearMe";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
    IReferral,
    mentalHealthConditions,
    orthoticInjuryLocations,
    otherServices,
    physiotherapyConditions,
    prostheticInjuryLocations,
    wheelchairExperiences,
} from "@cbr/common/util/referrals";
import { themeColors } from "@cbr/common/util/colors";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { timestampToDateTime } from "@cbr/common/util/dates";
import { Thumb } from "components/ReferralPhotoView/Thumb";
import TimelineEntry from "../Timeline/TimelineEntry";
import { useHistory, useLocation } from "react-router-dom";
import * as Styled from "./Entry.styles";

const OPEN = "open";

interface IEntryProps {
    referral: IReferral;
    refreshClient: () => void;
    dateFormatter: (timestamp: number) => string;
}

const ReferralEntry = ({ referral, refreshClient, dateFormatter }: IEntryProps) => {
    const location = useLocation();
    const history = useHistory();

    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        setOpen(query.get(referral?.id.toString()) === OPEN);
    }, [referral, location.search]);

    const openModal = () => {
        history.push(`${location.pathname}?${referral?.id.toString()}=${OPEN}`); // Add query param
    };

    const closeModal = () => {
        setOpen(false);
        history.push(location.pathname); // Remove query param
    };

    const Summary = ({ clickable }: { clickable: boolean }) => {
        const ReasonChip = ({ label }: { label: string }) => (
            <Chip label={label} clickable={clickable} color="primary" variant="outlined" />
        );

        return (
            <Styled.ReferralSummaryContainer>
                {referral.resolved ? (
                    <div>
                        <Styled.CompleteIcon fontSize="small" />
                        <Trans i18nKey="referralAttr.resolutionStatus_resolved_bold">
                            -<b>Referral</b> Resolved
                        </Trans>
                    </div>
                ) : (
                    <div>
                        <Styled.PendingIcon fontSize="small" />
                        <Trans i18nKey="referralAttr.resolutionStatus_pending_bold">
                            -<b>Referral</b> Pending
                        </Trans>
                    </div>
                )}
                {referral.wheelchair && <ReasonChip label={t("referral.wheelchair")} />}
                {referral.physiotherapy && <ReasonChip label={t("referral.physiotherapy")} />}
                {referral.prosthetic && <ReasonChip label={t("referral.prosthetic")} />}
                {referral.orthotic && <ReasonChip label={t("referral.orthotic")} />}
                {referral.hha_nutrition_and_agriculture_project && (
                    <ReasonChip label={t("general.nutrition")} />
                )}
                {referral.mental_health && <ReasonChip label={t("referral.mental")} />}
                {referral.services_other && <ReasonChip label={t("referral.other")} />}
            </Styled.ReferralSummaryContainer>
        );
    };

    const ResolveForm = () => {
        const outcomeField = {
            key: "outcome",
            label: "Outcome",
        };

        const initialValues = {
            [outcomeField.key]: "",
        };

        const validationSchema = Yup.object().shape({
            [outcomeField.key]: Yup.string().label(outcomeField.label).max(100).trim().required(),
        });

        const handleSubmit = (values: typeof initialValues) => {
            apiFetch(Endpoint.REFERRAL, `${referral.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    resolved: true,
                    [outcomeField.key]: values[outcomeField.key],
                }),
            })
                .then(() => refreshClient())
                .catch(() => alert(t("alert.generalFailureTryAgain")));
        };

        return (
            <Accordion variant="outlined">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                        <b>{t("general.resolve")}</b>
                    </Typography>
                </AccordionSummary>

                <Styled.ResolveAccordion>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <Field
                                sx={{ marginBottom: "1rem" }}
                                component={TextField}
                                label={outcomeField.label}
                                name={outcomeField.key}
                                variant="outlined"
                                fullWidth
                                required
                            />

                            <Button
                                sx={{ color: themeColors.riskGreen }}
                                type="submit"
                                variant="outlined"
                            >
                                {t("referralAttr.markResolved")}
                            </Button>
                        </Form>
                    </Formik>
                </Styled.ResolveAccordion>
            </Accordion>
        );
    };

    return (
        <>
            <TimelineEntry
                date={dateFormatter(referral.date_referred)}
                content={<Summary clickable={true} />}
                DotIcon={NearMeIcon}
                onClick={openModal}
            />

            <Dialog fullWidth maxWidth="sm" open={open} onClose={closeModal}>
                <DialogTitle>
                    <Summary clickable={false} />
                </DialogTitle>

                <Styled.ReferralDialogContent>
                    <b>{t("referralAttr.referralDate")}:</b>{" "}
                    {timestampToDateTime(referral.date_referred)}
                    {referral.resolved && (
                        <div>
                            <b>{t("referralAttr.resolutionDate")}:</b>{" "}
                            {timestampToDateTime(referral.date_resolved)}
                            <br />
                            <b>{t("general.outcome")}:</b> {referral.outcome}
                        </div>
                    )}
                    {referral.wheelchair && (
                        <div>
                            <b>{t("referral.wheelchairExperience")}: </b>
                            {wheelchairExperiences[referral.wheelchair_experience]}
                            <br />
                            <b>{t("referral.hipWidth")}:</b> {referral.hip_width}{" "}
                            {t("referral.inches")}
                            <br />
                            <b>{t("referral.ownership")}?</b>{" "}
                            {referral.wheelchair_owned ? t("general.yes") : t("general.no")}
                            <br />
                            <b>{t("referral.repairability")}?</b>{" "}
                            {referral.wheelchair_repairable ? t("general.yes") : t("general.no")}
                            <br />
                            <Thumb Id={referral.id} Url={referral.picture} />
                        </div>
                    )}
                    {referral.physiotherapy && (
                        <div>
                            <b>{t("referralAttr.condition_physiotherapy")}:</b>{" "}
                            {physiotherapyConditions(t)[referral.condition]
                                ? physiotherapyConditions(t)[referral.condition]
                                : referral.condition}
                        </div>
                    )}
                    {referral.prosthetic && (
                        <div>
                            <b>{t("referralAttr.injuryLocation_prosthetic")}: </b>
                            {prostheticInjuryLocations[referral.prosthetic_injury_location]}
                        </div>
                    )}
                    {referral.orthotic && (
                        <div>
                            <b>{t("referralAttr.injuryLocation_orthotic")}: </b>
                            {orthoticInjuryLocations[referral.orthotic_injury_location]}
                        </div>
                    )}
                    {referral.hha_nutrition_and_agriculture_project && (
                        <div>
                            <b>{t("referral.emergencyFoodAidIsRequired")}: </b>
                            {referral.emergency_food_aid ? t("general.yes") : t("general.no")}
                            <br />
                            <b>{t("referral.agricultureLivelihoodProgramEnrollmentRequired")}: </b>
                            {referral.agriculture_livelihood_program_enrollment
                                ? t("general.yes")
                                : t("general.no")}
                        </div>
                    )}
                    {referral.mental_health && (
                        <div>
                            <b>{t("referralAttr.condition_mental")}: </b>
                            {mentalHealthConditions[referral.mental_health_condition]
                                ? mentalHealthConditions[referral.mental_health_condition]
                                : referral.mental_health_condition}
                        </div>
                    )}
                    {Boolean(referral.services_other.trim().length) && (
                        <div>
                            <b>{t("referralAttr.otherServiceRequired")}: </b>
                            {otherServices[referral.services_other]
                                ? otherServices[referral.services_other]
                                : referral.services_other}
                        </div>
                    )}
                    {!referral.resolved && <ResolveForm />}
                </Styled.ReferralDialogContent>

                <DialogActions>
                    <Button onClick={closeModal} color="primary">
                        {t("general.close")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ReferralEntry;
