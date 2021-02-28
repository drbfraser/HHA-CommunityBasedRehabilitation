import React, { useState, useEffect } from "react";
import { useStyles } from "./ClientRisks.styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";

import {
    Grid,
    Card,
    CardActions,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    MenuItem,
    FormControl,
} from "@material-ui/core";
import { IRisk, riskOptions } from "util/riskOptions";
import RiskChip from "components/RiskChip/RiskChip";

import { fieldLabels, FormField, validationSchema } from "./riskFormFields";

import { handleSubmit } from "./riskFormFieldHandler";

interface RiskInterface {
    risk_level: string;
    risk_type: string;
    requirement: string;
    goal: string;
}

const ClientRisks = (props: any) => {
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [currentViewingRisk, setCurrentViewingRisk] = useState<RiskInterface>();

    const [healthRiskChip, setHealthRiskChip] = useState<IRisk>();
    const [socialRiskChip, setSocialRiskChip] = useState<IRisk>();
    const [educatRiskChip, setEducatRiskChip] = useState<IRisk>();

    const styles = useStyles();

    useEffect(() => {
        setHealthRiskChip(riskOptions[props.healthRisk.risk_level]);
        setSocialRiskChip(riskOptions[props.socialRisk.risk_level]);
        setEducatRiskChip(riskOptions[props.educatRisk.risk_level]);
    }, [props]);

    const FormModal = () => {
        return currentViewingRisk ? (
            <>
                <Formik
                    onSubmit={() => {
                        handleSubmit();
                        setIsFormOpen(false);
                    }}
                    initialValues={currentViewingRisk}
                    validationSchema={validationSchema}
                >
                    {({ isSubmitting }) => (
                        <Dialog
                            fullWidth
                            open={isFormOpen}
                            onClose={() => {
                                setIsFormOpen(false);
                            }}
                            aria-labelledby="form-dialog-title"
                        >
                            <Form>
                                <DialogTitle id="form-dialog-title">
                                    Update {currentViewingRisk.risk_type} Risk
                                </DialogTitle>
                                <DialogContent>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            select
                                            required
                                            variant="outlined"
                                            label={fieldLabels[FormField.risk_level]}
                                            name={FormField.risk_level}
                                        >
                                            {Object.entries(riskOptions).map(
                                                ([value, { name }]) => (
                                                    <MenuItem key={value} value={value}>
                                                        {name}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Field>
                                    </FormControl>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        multiline
                                        required
                                        rows={4}
                                        variant="outlined"
                                        margin="dense"
                                        label={fieldLabels[FormField.requirement]}
                                        name={FormField.requirement}
                                    />
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        margin="dense"
                                        multiline
                                        required
                                        rows={4}
                                        variant="outlined"
                                        label={fieldLabels[FormField.goal]}
                                        name={FormField.goal}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        type="reset"
                                        disabled={isSubmitting}
                                        onClick={() => {
                                            setIsFormOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Form>
                        </Dialog>
                    )}
                </Formik>
            </>
        ) : (
            <></>
        );
    };

    const renderRiskCard = (riskInfo: any, riskChip: IRisk) => {
        return (
            <Card variant="outlined">
                <CardContent>
                    <Grid container direction="row" justify="space-between">
                        <Grid item md={6}>
                            <Typography variant="h5" component="h1">
                                {riskInfo.risk_type === "EDUCAT" ? "EDUCATION" : riskInfo.risk_type}
                            </Typography>
                        </Grid>
                        <Grid item md={6}>
                            <div className={styles.riskCardBadge}>
                                {" "}
                                <RiskChip risk={riskChip} />
                            </div>
                        </Grid>
                    </Grid>
                    <br />
                    <Typography variant="subtitle2" component="h6">
                        Requirements:
                    </Typography>
                    <Typography variant="body2" component="p">
                        {riskInfo.requirement}
                    </Typography>
                    <br />
                    <Typography variant="subtitle2" component="h6">
                        Goals:
                    </Typography>
                    <Typography variant="body2" component="p">
                        {riskInfo.goal}
                    </Typography>
                </CardContent>
                <CardActions className={styles.riskCardButton}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                            setCurrentViewingRisk(riskInfo);
                            setIsFormOpen(true);
                        }}
                    >
                        Update
                    </Button>
                </CardActions>
            </Card>
        );
    };

    return (
        <>
            <FormModal />
            <Grid container spacing={5} direction="row" justify="flex-start">
                <Grid item md={4} xs={12}>
                    {props.healthRisk && healthRiskChip ? (
                        renderRiskCard(props.healthRisk, healthRiskChip)
                    ) : (
                        <></>
                    )}
                </Grid>
                <Grid item md={4} xs={12}>
                    {props.educatRisk && educatRiskChip ? (
                        renderRiskCard(props.educatRisk, educatRiskChip)
                    ) : (
                        <></>
                    )}
                </Grid>
                <Grid item md={4} xs={12}>
                    {props.socialRisk && socialRiskChip ? (
                        renderRiskCard(props.socialRisk, socialRiskChip)
                    ) : (
                        <></>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default ClientRisks;
