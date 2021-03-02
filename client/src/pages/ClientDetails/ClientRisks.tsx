import React, { useState } from "react";
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
import { IRisk, riskLevels, riskTypes } from "util/risks";
import RiskChip from "components/RiskChip/RiskChip";

import { fieldLabels, FormField, validationSchema } from "./riskFormFields";

import { handleSubmit } from "./riskFormFieldHandler";

const ClientRisks = (props: any) => {
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [currentViewingRisk, setCurrentViewingRisk] = useState<IRisk>();

    const styles = useStyles();

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
                                    Update {riskTypes[currentViewingRisk.risk_type].name} Risk
                                </DialogTitle>
                                <DialogContent>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <FormControl fullWidth variant="outlined">
                                                <Field
                                                    component={TextField}
                                                    select
                                                    required
                                                    variant="outlined"
                                                    label={fieldLabels[FormField.risk_level]}
                                                    name={FormField.risk_level}
                                                >
                                                    {Object.entries(riskLevels).map(
                                                        ([value, { name }]) => (
                                                            <MenuItem key={value} value={value}>
                                                                {name}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Field>
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
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
                                        </Grid>
                                        <Grid item>
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
                                        </Grid>
                                    </Grid>
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

    const renderRiskCard = (riskInfo: IRisk) => {
        return (
            <Card variant="outlined">
                <CardContent>
                    <Grid container direction="row" justify="space-between">
                        <Grid item md={6}>
                            <Typography variant="h5" component="h1">
                                {riskTypes[riskInfo.risk_type].name}
                            </Typography>
                        </Grid>
                        <Grid item md={6}>
                            <div className={styles.riskCardButtonAndBadge}>
                                {" "}
                                <RiskChip risk={riskInfo.risk_level} />
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
                <CardActions className={styles.riskCardButtonAndBadge}>
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
                    {renderRiskCard(props.healthRisk)}
                </Grid>
                <Grid item md={4} xs={12}>
                    {renderRiskCard(props.educatRisk)}
                </Grid>
                <Grid item md={4} xs={12}>
                    {renderRiskCard(props.socialRisk)}
                </Grid>
            </Grid>
        </>
    );
};

export default ClientRisks;
