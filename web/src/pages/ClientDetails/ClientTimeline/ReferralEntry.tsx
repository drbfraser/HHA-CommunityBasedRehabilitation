import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { timestampToDateTime } from "@cbr/common/util/dates";
import TimelineEntry from "../Timeline/TimelineEntry";
import { entryStyles } from "./Entry.styles";
import { Thumb } from "components/ReferralPhotoView/Thumb";

interface IEntryProps {
    referral: IReferral;
    refreshClient: () => void;
    dateFormatter: (timestamp: number) => string;
}

const ReferralEntry = ({ referral, refreshClient, dateFormatter }: IEntryProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const Summary = ({ clickable }: { clickable: boolean }) => {
        const ReasonChip = ({ label }: { label: string }) => (
            <Chip label={label} clickable={clickable} color="primary" variant="outlined" />
        );

        return (
            <>
                {referral.resolved ? (
                    <>
                        <CheckCircleIcon fontSize="small" sx={entryStyles.completeIcon} />{" "}
                        <Trans i18nKey="referralAttr.resolutionStatus_resolved_bold">
                            -<b>Referral</b> Resolved
                        </Trans>{" "}
                    </>
                ) : (
                    <>
                        <ScheduleIcon fontSize="small" sx={entryStyles.pendingIcon} />{" "}
                        <Trans i18nKey="referralAttr.resolutionStatus_pending_bold">
                            -<b>Referral</b> Pending
                        </Trans>{" "}
                    </>
                )}
                {referral.wheelchair && <ReasonChip label={t("referral.wheelchair")} />}{" "}
                {referral.physiotherapy && <ReasonChip label={t("referral.physiotherapy")} />}{" "}
                {referral.prosthetic && <ReasonChip label={t("referral.prosthetic")} />}{" "}
                {referral.orthotic && <ReasonChip label={t("referral.orthotic")} />}{" "}
                {referral.hha_nutrition_and_agriculture_project && (
                    <ReasonChip label={t("general.nutrition")} />
                )}{" "}
                {referral.mental_health && <ReasonChip label={t("referral.mental")} />}{" "}
                {referral.services_other && <ReasonChip label={t("referral.other")} />}{" "}
            </>
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
                <AccordionDetails sx={entryStyles.resolveAccordion}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <Field
                                component={TextField}
                                label={outcomeField.label}
                                name={outcomeField.key}
                                variant="outlined"
                                fullWidth
                                required
                            />
                            <br />
                            <br />
                            <Button type="submit" variant="outlined" sx={entryStyles.resolveBtn}>
                                {t("referralAttr.markResolved")}
                            </Button>
                        </Form>
                    </Formik>
                </AccordionDetails>
            </Accordion>
        );
    };

    const ReferralDialog = () => {
        const translatedYes = t("general.yes");
        const translatedNo = t("general.no");

        return (
            <Dialog fullWidth maxWidth="sm" open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                    <Summary clickable={false} />
                </DialogTitle>
                <DialogContent>
                    <b>{t("referralAttr.referralDate")}:</b>{" "}
                    {timestampToDateTime(referral.date_referred)}
                    <br />
                    <br />
                    {referral.resolved && (
                        <>
                            <b>{t("referralAttr.resolutionDate")}:</b>{" "}
                            {timestampToDateTime(referral.date_resolved)}
                            <br />
                            <b>{t("general.outcome")}:</b> {referral.outcome}
                            <br />
                            <br />
                        </>
                    )}
                    {referral.wheelchair && (
                        <>
                            <b>{t("referral.wheelchairExperience")}: </b>
                            {wheelchairExperiences[referral.wheelchair_experience]}
                            <br />
                            <b>{t("referral.hipWidth")}:</b> {referral.hip_width}{" "}
                            {t("referral.inches")}
                            <br />
                            <b>{t("referral.ownership")}?</b>{" "}
                            {referral.wheelchair_owned ? translatedYes : translatedNo}
                            <br />
                            <b>{t("referral.repairability")}?</b>{" "}
                            {referral.wheelchair_repairable ? translatedYes : translatedNo}
                            <br />
                            <Thumb Id={referral.id} Url={referral.picture}></Thumb>
                            <br />
                        </>
                    )}
                    {referral.physiotherapy && (
                        <>
                            <b>{t("referralAttr.condition_physiotherapy")}:</b>{" "}
                            {physiotherapyConditions(t)[referral.condition]}
                            <br />
                            <br />
                        </>
                    )}
                    {referral.prosthetic && (
                        <>
                            <b>{t("referralAttr.injuryLocation_prosthetic")}: </b>
                            {prostheticInjuryLocations[referral.prosthetic_injury_location]}
                            <br />
                            <br />
                        </>
                    )}
                    {referral.orthotic && (
                        <>
                            <b>{t("referralAttr.injuryLocation_orthotic")}: </b>
                            {orthoticInjuryLocations[referral.orthotic_injury_location]}
                            <br />
                            <br />
                        </>
                    )}
                    {referral.hha_nutrition_and_agriculture_project && (
                        <>
                            <b>{t("referral.emergencyFoodAidIsRequired")}: </b>
                            {referral.emergency_food_aid ? translatedYes : translatedNo}
                            <br />
                            <b>{t("referral.agricultureLivelihoodProgramEnrollmentRequired")}: </b>
                            {referral.agriculture_livelihood_program_enrollment
                                ? translatedYes
                                : translatedNo}
                            <br />
                            <br />
                        </>
                    )}
                    {referral.mental_health && (
                        <>
                            <b>{t("referralAttr.condition_mental")}: </b>
                            {mentalHealthConditions[referral.mental_health_condition]}
                            <br />
                            <br />
                        </>
                    )}
                    {Boolean(referral.services_other.trim().length) && (
                        <>
                            <b>{t("referralAttr.otherServiceRequired")}: </b>
                            {otherServices[referral.services_other]}
                            <br />
                            <br />
                        </>
                    )}
                    {!referral.resolved && <ResolveForm />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        {t("general.close")}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <>
            <TimelineEntry
                date={dateFormatter(referral.date_referred)}
                content={<Summary clickable={true} />}
                DotIcon={NearMeIcon}
                onClick={() => setOpen(true)}
            />
            <ReferralDialog />
        </>
    );
};

export default ReferralEntry;
