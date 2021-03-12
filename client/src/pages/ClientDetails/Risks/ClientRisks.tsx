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
import { IClient } from "util/clients";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";

import { fieldLabels, FormField, validationSchema } from "./riskFormFields";

import { handleSubmit } from "./riskFormFieldHandler";

interface IProps {
    clientInfo: IClient;
}

const ClientRisks = ({ clientInfo }: IProps) => {
    const styles = useStyles();
    const [risks] = useState<IRisk[]>(clientInfo.risks);

    interface IModalProps {
        risk: IRisk;
        setRisk: (risk: IRisk) => void;
        close: () => void;
    }

    const FormModal = (props: IModalProps) => {
        return (
            <Formik
                onSubmit={(values) => {
                    handleSubmit(values, props.risk, props.setRisk);
                    props.close();
                }}
                initialValues={props.risk}
                validationSchema={validationSchema}
            >
                {({ isSubmitting }) => (
                    <Dialog fullWidth open={true} aria-labelledby="form-dialog-title">
                        <Form>
                            <DialogTitle id="form-dialog-title">
                                Update {riskTypes[props.risk.risk_type].name} Risk
                            </DialogTitle>
                            <DialogContent>
                                <Grid container direction="column" spacing={2}>
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
                                        props.close();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Form>
                    </Dialog>
                )}
            </Formik>
        );
    };

    interface ICardProps {
        risk: IRisk;
    }

    const RiskCard = (props: ICardProps) => {
        const [risk, setRisk] = useState(props.risk);
        const [isModalOpen, setIsModalOpen] = useState(false);
        return (
            <>
                {isModalOpen && (
                    <FormModal risk={risk} setRisk={setRisk} close={() => setIsModalOpen(false)} />
                )}
                <Card variant="outlined">
                    <CardContent>
                        <Grid container direction="row" justify="space-between">
                            <Grid item md={6}>
                                <Typography variant="h5" component="h1">
                                    {riskTypes[risk.risk_type].name}
                                </Typography>
                            </Grid>
                            <Grid item md={6}>
                                <div className={styles.riskCardButtonAndBadge}>
                                    {" "}
                                    <RiskLevelChip risk={risk.risk_level} />
                                </div>
                            </Grid>
                        </Grid>
                        <br />
                        <Typography variant="subtitle2" component="h6">
                            Requirements:
                        </Typography>
                        <Typography variant="body2" component="p">
                            {risk.requirement}
                        </Typography>
                        <br />
                        <Typography variant="subtitle2" component="h6">
                            Goals:
                        </Typography>
                        <Typography variant="body2" component="p">
                            {risk.goal}
                        </Typography>
                    </CardContent>
                    <CardActions className={styles.riskCardButtonAndBadge}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => {
                                setIsModalOpen(true);
                            }}
                        >
                            Update
                        </Button>
                    </CardActions>
                </Card>
            </>
        );
    };

    return risks ? (
        <div className={styles.riskCardContainer}>
            <Grid container spacing={5} direction="row" justify="flex-start">
                {Object.keys(riskTypes).map((type) => (
                    <Grid item md={4} xs={12} key={type}>
                        <RiskCard risk={risks.filter((r) => r.risk_type === type)[0]} />
                    </Grid>
                ))}
            </Grid>
        </div>
    ) : (
        <></>
    );
};

export default ClientRisks;
