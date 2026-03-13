import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import {
    Alert,
    Button,
    FormControl,
    FormLabel,
    Typography,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Stack,
} from "@mui/material";
import { FieldArray, Form, Formik, FormikHelpers, FormikProps } from "formik";

import {
    visitFieldLabels,
    VisitFormField,
    visitInitialValues,
    provisionals,
    initialValidationSchema,
    visitTypeValidationSchema,
    getVisitGoalLabel,
    VisitField,
} from "@cbr/common/forms/newVisit/visitFormFields";
import { IRisk, RiskType } from "@cbr/common/util/risks";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { IClient } from "@cbr/common/util/clients";
import { TZoneMap, useZones } from "@cbr/common/util/hooks/zones";
import { handleSubmit } from "./formHandler";
import GoBackButton from "components/GoBackButton/GoBackButton";
import { ImprovementField, VisitReasonStep } from "./components";
import { OutcomeGoalMet } from "@cbr/common/util/visits";
import ClientRisksModal from "../../pages/ClientDetails/Risks/ClientRisksModal";
import PreviousGoalsModal from "../../pages/ClientDetails/PreviousGoals/PreviousGoalsModal/PreviousGoalsModal";
import GoalField from "./components/GoalField";
import * as Yup from "yup";
import { PhotoView } from "components/ReferralPhotoView/PhotoView";
import PatientNoteModal from "components/PatientNoteModal/PatientNoteModal";

interface IStepProps {
    formikProps: FormikProps<any>;
    setRisk: (risk: IRisk) => void;
    setIsModalOpen: (val: boolean) => void;
    setIsPreviousGoalsModalOpen: (val: boolean) => void;
    setOpenPatientNote: (val: boolean) => void;
}

const VisitTypeStep = (visitType: VisitFormField, risks: IRisk[], t: TFunction) => {
    return ({
        formikProps,
        setRisk,
        setIsModalOpen,
        setIsPreviousGoalsModalOpen,
        setOpenPatientNote,
    }: IStepProps) => {
        const matchingRisk = risks.find(
            (risk) => risk.risk_type === (visitType as unknown as RiskType)
        );

        return (
            <FormControl>
                <FormLabel focused={false}>{t("newVisit.selectImprovement")}</FormLabel>
                <FieldArray
                    name={VisitFormField.improvements}
                    render={() =>
                        provisionals[visitType].map((provided, index) => (
                            <ImprovementField
                                key={index}
                                formikProps={formikProps}
                                visitType={visitType}
                                provided={provided}
                                index={index}
                            />
                        ))
                    }
                />
                <Typography component="div">
                    <br />
                </Typography>
                {matchingRisk && matchingRisk.goal_status === OutcomeGoalMet.NOTSET ? (
                    <>
                        <FormLabel focused={false}>{getVisitGoalLabel(t, visitType)}</FormLabel>
                        <Typography variant={"body1"}>{matchingRisk?.goal_name}</Typography>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setRisk(matchingRisk);
                                setIsModalOpen(true);
                            }}
                        >
                            {t("goals.createNew")} {visitFieldLabels[visitType]} {t("general.goal")}
                        </Button>
                    </>
                ) : matchingRisk &&
                  (matchingRisk.goal_status === OutcomeGoalMet.CONCLUDED ||
                      matchingRisk.goal_status === OutcomeGoalMet.CANCELLED) ? (
                    <>
                        <FormLabel focused={false}>{getVisitGoalLabel(t, visitType)}</FormLabel>
                        <Typography variant="body1">{t("goals.noCurrentOngoingGoals")}</Typography>
                        <Stack direction="row" spacing={2} mt={1}>
                            <Button
                                variant="outlined"
                                size="medium"
                                onClick={() => {
                                    setRisk(matchingRisk);
                                    setIsPreviousGoalsModalOpen(true);
                                }}
                            >
                                {t("goals.previousGoals")}
                            </Button>
                            <Button
                                variant="contained"
                                size="medium"
                                onClick={() => {
                                    setRisk(matchingRisk);
                                    setIsModalOpen(true);
                                }}
                            >
                                {t("goals.createNew")} {visitFieldLabels[visitType]}{" "}
                                {t("general.goal")}
                            </Button>
                        </Stack>
                    </>
                ) : matchingRisk ? (
                    <>
                        <GoalField
                            risk={matchingRisk}
                            setRisk={setRisk}
                            close={() => setIsModalOpen(false)}
                            newGoal={false}
                            visitType={visitType}
                            risks={risks}
                        />
                        <Stack direction="row" spacing={2} mt={1}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setRisk(matchingRisk);
                                    setIsModalOpen(true);
                                }}
                            >
                                {t("general.update")} {visitFieldLabels[visitType]}{" "}
                                {t("general.goal")}
                            </Button>
                            <Button
                                variant="contained"
                                color="primary" // Or another color to differentiate it
                                onClick={() => setOpenPatientNote(true)}
                            >
                                {"Patient Note"}
                            </Button>
                        </Stack>
                    </>
                ) : null}
                <Typography component="div">
                    <br />
                </Typography>
            </FormControl>
        );
    };
};

const visitReasonStepCallBack =
    (setEnabledSteps: React.Dispatch<React.SetStateAction<VisitFormField[]>>, zones: TZoneMap) =>
    ({ formikProps }: IStepProps) =>
        VisitReasonStep(formikProps, setEnabledSteps, zones);

const NewVisit = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [enabledSteps, setEnabledSteps] = useState<VisitFormField[]>([]);
    const [risks, setRisks] = useState<IRisk[]>([]);
    const [submissionError, setSubmissionError] = useState<string>();
    const [loadingError, setLoadingError] = useState(false);
    const zones = useZones();
    const { clientId } = useParams<{ clientId: string }>();
    const { t } = useTranslation();
    const [openPatientNote, setOpenPatientNote] = useState(false);

    useEffect(() => {
        apiFetch(Endpoint.CLIENT, `${clientId}`)
            .then((resp) => resp.json())
            .then((client: IClient) => {
                client.risks.sort((a: IRisk, b: IRisk) => b.timestamp - a.timestamp);
                setRisks(client.risks);
            })
            .catch(() => {
                setLoadingError(true);
            });
    }, [clientId]);

    // Enabled steps + 1 to account for Image Upload
    const isFinalStep = activeStep === enabledSteps.length + 1 && activeStep !== 0;

    const visitSteps = [
        {
            label: `${visitFieldLabels[VisitFormField.visit_focus]}`,
            Form: visitReasonStepCallBack(setEnabledSteps, zones),
            validationSchema: initialValidationSchema,
        },
        ...enabledSteps.map((visitType) => ({
            label: `${visitFieldLabels[visitType]} ${t("newVisit.visit")}`,
            Form: VisitTypeStep(visitType, risks, t),
            validationSchema: visitTypeValidationSchema(visitType),
        })),
        {
            label: t("referral.addPicture"),
            Form: ({ formikProps }: IStepProps) => (
                <>
                    <PhotoView
                        onPictureChange={(pictureURL) => {
                            void formikProps.setFieldValue(VisitField.picture, pictureURL);
                        }}
                    />
                </>
            ),
            validationSchema: () => Yup.object({}), // Empty, picture submission is optional
        },
    ];

    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            handleSubmit(values, helpers, setSubmissionError);
        } else {
            if (activeStep === 0) {
                helpers.setFieldValue(`${[VisitFormField.client_id]}`, clientId);
            }
            setActiveStep(activeStep + 1);
            helpers.setSubmitting(false);
            helpers.setTouched({});
        }
    };

    const prevStep = () => {
        setActiveStep(activeStep - 1);
    };

    const [selectedRisk, setSelectedRisk] = useState<IRisk | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [isPreviousGoalsModalOpen, setIsPreviousGoalsModalOpen] = useState<boolean>(false);

    return loadingError ? (
        <Alert severity="error">{t("alert.loadClientFailure")}</Alert>
    ) : (
        <Formik
            initialValues={visitInitialValues}
            validationSchema={visitSteps[activeStep].validationSchema}
            onSubmit={nextStep}
        >
            {(formikProps) => (
                <>
                    <Form>
                        {submissionError && (
                            <Alert onClose={() => setSubmissionError(undefined)} severity="error">
                                {t("alert.submitVisitError")}: {submissionError}
                            </Alert>
                        )}
                        <GoBackButton />

                        <Stepper activeStep={activeStep} orientation="vertical">
                            {visitSteps.map((visitStep, index) => (
                                <Step key={index}>
                                    <StepLabel>{visitStep.label}</StepLabel>
                                    <StepContent>
                                        <visitStep.Form
                                            formikProps={formikProps}
                                            setRisk={setSelectedRisk}
                                            setIsModalOpen={setIsModalOpen}
                                            setIsPreviousGoalsModalOpen={
                                                setIsPreviousGoalsModalOpen
                                            }
                                            setOpenPatientNote={setOpenPatientNote}
                                        />
                                        <br />
                                        <br />
                                        {activeStep !== 0 && (
                                            <Button
                                                style={{ marginRight: "5px" }}
                                                variant="outlined"
                                                color="primary"
                                                onClick={prevStep}
                                            >
                                                {t("general.previous")}
                                            </Button>
                                        )}
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={Boolean(
                                                !(
                                                    formikProps.values[VisitFormField.health] ||
                                                    formikProps.values[VisitFormField.education] ||
                                                    formikProps.values[VisitFormField.social] ||
                                                    formikProps.values[VisitFormField.nutrition] ||
                                                    formikProps.values[VisitFormField.mental]
                                                )
                                            )}
                                        >
                                            {isFinalStep && index === activeStep
                                                ? t("general.submit")
                                                : t("general.next")}
                                        </Button>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </Form>
                    {selectedRisk && isModalOpen && (
                        <ClientRisksModal
                            risk={selectedRisk}
                            setRisk={(updatedRisk) => {
                                setRisks((prevRisks) => [updatedRisk, ...prevRisks]);
                                setIsModalOpen(false);
                            }}
                            close={() => setIsModalOpen(false)}
                            newGoal={selectedRisk.goal_status !== OutcomeGoalMet.ONGOING}
                        />
                    )}
                    {selectedRisk && isPreviousGoalsModalOpen && (
                        <PreviousGoalsModal
                            clientId={clientId}
                            close={() => setIsPreviousGoalsModalOpen(false)}
                        />
                    )}
                    <PatientNoteModal
                        open={openPatientNote}
                        clientId={clientId}
                        onClose={() => setOpenPatientNote(false)}
                    />
                </>
            )}
        </Formik>
    );
};

export default NewVisit;
