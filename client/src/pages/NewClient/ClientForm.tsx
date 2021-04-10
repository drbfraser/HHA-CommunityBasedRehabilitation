import React, { useState, useEffect } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";

import { useStyles } from "./ClientForm.styles";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import { fieldLabels, FormField, initialValues, validationSchema } from "./formFields";

import { riskLevels } from "util/risks";
import { handleSubmit, handleReset } from "./formHandler";
import { genders } from "util/clients";
import { useDisabilities } from "util/hooks/disabilities";
import { useZones } from "util/hooks/zones";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ClientForm = () => {
    const styles = useStyles();
    const zones = useZones();
    const disabilities = useDisabilities();

    const [profilePicture, setProfilePicture] = useState("/images/profile_pic_icon.png");
    const [croppedProfilePicture, setCroppedProfilePicture] = useState(
        "/images/profile_pic_icon.png"
    );

    const [cropper, setCropper] = useState<any>();
    const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

    const profilePicRef: React.RefObject<HTMLInputElement> = React.createRef();

    useEffect(() => {
        return () => {
            setCroppedProfilePicture("/images/profile_pic_icon.png");
        };
    }, [setCroppedProfilePicture]);

    const onSelectFile = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setProfilePicture(reader.result as any);
        };
        if (files[0]) reader.readAsDataURL(files[0]);
        if (profilePicture) setProfileModalOpen(true);
        e.target.value = null;
    };

    const triggerFileUpload = () => {
        profilePicRef.current!.click();
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, isSubmitting, resetForm, errors, touched }) => (
                <Grid container direction="row" justify="flex-start" spacing={2}>
                    <Grid item md={2} xs={12}>
                        <Card
                            className={`${styles.profileImgContainer} ${styles.profileUploadHover}`}
                        >
                            <CardContent onClick={triggerFileUpload}>
                                <img
                                    className={styles.profilePicture}
                                    src={croppedProfilePicture}
                                    alt="user-icon"
                                />
                                <div className={styles.uploadIcon}>
                                    <CloudUploadIcon />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={profilePicRef}
                                        style={{ visibility: "hidden" }}
                                        onChange={(e: any) => {
                                            onSelectFile(e);
                                        }}
                                    />
                                </div>
                            </CardContent>
                            <Dialog
                                open={profileModalOpen}
                                onClose={() => {
                                    setProfileModalOpen(false);
                                }}
                                aria-labelledby="form-modal-title"
                            >
                                <DialogContent>
                                    <Cropper
                                        style={{ height: 400, width: "100%" }}
                                        responsive={true}
                                        minCropBoxHeight={10}
                                        minCropBoxWidth={10}
                                        viewMode={1}
                                        src={profilePicture}
                                        background={false}
                                        onInitialized={(instance) => {
                                            setCropper(instance);
                                        }}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={() => {
                                            if (typeof cropper !== undefined) {
                                                values.picture = cropper
                                                    .getCroppedCanvas()
                                                    .toDataURL();
                                                setCroppedProfilePicture(values.picture);
                                            }
                                            setProfileModalOpen(false);
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                            setProfileModalOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Card>
                    </Grid>
                    <Grid item md={10} xs={12}>
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        name={FormField.firstName}
                                        variant="outlined"
                                        label={fieldLabels[FormField.firstName]}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        name={FormField.lastName}
                                        variant="outlined"
                                        label={fieldLabels[FormField.lastName]}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        required
                                        type="date"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        label={fieldLabels[FormField.birthDate]}
                                        name={FormField.birthDate}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            fullWidth
                                            select
                                            required
                                            variant="outlined"
                                            label={fieldLabels[FormField.gender]}
                                            name={FormField.gender}
                                        >
                                            {Object.entries(genders).map(([value, name]) => (
                                                <MenuItem key={value} value={value}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        variant="outlined"
                                        name={FormField.village}
                                        label={fieldLabels[FormField.village]}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            fullWidth
                                            select
                                            variant="outlined"
                                            required
                                            label={fieldLabels[FormField.zone]}
                                            name={FormField.zone}
                                        >
                                            {Array.from(zones).map(([id, name]) => (
                                                <MenuItem key={id} value={id}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        name={FormField.phoneNumber}
                                        variant="outlined"
                                        label={fieldLabels[FormField.phoneNumber]}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        select
                                        SelectProps={{
                                            multiple: true,
                                        }}
                                        label={fieldLabels[FormField.disability]}
                                        required
                                        name={FormField.disability}
                                        variant="outlined"
                                    >
                                        {Array.from(disabilities).map(([id, name]) => (
                                            <MenuItem key={id} value={id}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <Field
                                        component={CheckboxWithLabel}
                                        type="checkbox"
                                        name={FormField.caregiverPresent}
                                        Label={{ label: fieldLabels[FormField.caregiverPresent] }}
                                    />
                                </Grid>
                                {values.caregiverPresent ? (
                                    <Grid item md={7} xs={12}>
                                        <Accordion
                                            className={styles.caregiverAccordion}
                                            defaultExpanded
                                        >
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                Caregiver Details:
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container direction="column" spacing={1}>
                                                    <Grid item md={8} xs={12}>
                                                        <Field
                                                            className={styles.caregiverInputField}
                                                            component={TextField}
                                                            name={FormField.caregiverName}
                                                            variant="outlined"
                                                            label={
                                                                fieldLabels[FormField.caregiverName]
                                                            }
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item md={8} xs={12}>
                                                        <Field
                                                            className={`${styles.caregiverInputField} ${styles.disabledTextField}`}
                                                            component={TextField}
                                                            name={FormField.caregiverEmail}
                                                            variant="outlined"
                                                            label={
                                                                fieldLabels[
                                                                    FormField.caregiverEmail
                                                                ]
                                                            }
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item md={8} xs={12}>
                                                        <Field
                                                            className={styles.caregiverInputField}
                                                            component={TextField}
                                                            name={FormField.caregiverPhone}
                                                            variant="outlined"
                                                            label={
                                                                fieldLabels[
                                                                    FormField.caregiverPhone
                                                                ]
                                                            }
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                ) : (
                                    <></>
                                )}

                                <Grid item md={12} xs={12}>
                                    <hr />
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            select
                                            required
                                            variant="outlined"
                                            label={fieldLabels[FormField.healthRisk]}
                                            name={FormField.healthRisk}
                                        >
                                            {Object.entries(riskLevels).map(([value, { name }]) => (
                                                <MenuItem key={value} value={value}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>

                                <Grid item md={8} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        multiline
                                        required
                                        rows={4}
                                        variant="outlined"
                                        label={fieldLabels[FormField.healthRequirements]}
                                        name={FormField.healthRequirements}
                                    />
                                </Grid>

                                <Grid item md={8} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        required
                                        variant="outlined"
                                        label={fieldLabels[FormField.healthGoals]}
                                        name={FormField.healthGoals}
                                    />
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            select
                                            required
                                            variant="outlined"
                                            label={fieldLabels[FormField.educationRisk]}
                                            name={FormField.educationRisk}
                                        >
                                            {Object.entries(riskLevels).map(([value, { name }]) => (
                                                <MenuItem key={value} value={value}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>

                                <Grid item md={8} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        required
                                        variant="outlined"
                                        label={fieldLabels[FormField.educationRequirements]}
                                        name={FormField.educationRequirements}
                                    />
                                </Grid>

                                <Grid item md={8} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        multiline
                                        required
                                        rows={4}
                                        variant="outlined"
                                        label={fieldLabels[FormField.educationGoals]}
                                        name={FormField.educationGoals}
                                    />
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            select
                                            variant="outlined"
                                            required
                                            label={fieldLabels[FormField.socialRisk]}
                                            name={FormField.socialRisk}
                                        >
                                            {Object.entries(riskLevels).map(([value, { name }]) => (
                                                <MenuItem key={value} value={value}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>

                                <Grid item md={8} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        multiline
                                        required
                                        rows={4}
                                        variant="outlined"
                                        label={fieldLabels[FormField.socialRequirements]}
                                        name={FormField.socialRequirements}
                                    />
                                </Grid>

                                <Grid item md={8} xs={12}>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        required
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        label={fieldLabels[FormField.socialGoals]}
                                        name={FormField.socialGoals}
                                    />
                                </Grid>
                                <br />
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                    className={
                                        !values.interviewConsent && touched.interviewConsent
                                            ? styles.checkboxError
                                            : ""
                                    }
                                >
                                    <Field
                                        component={CheckboxWithLabel}
                                        type="checkbox"
                                        name={FormField.interviewConsent}
                                        Label={{ label: fieldLabels[FormField.interviewConsent] }}
                                        required
                                    />
                                    <ErrorMessage
                                        component="div"
                                        className={styles.errorMessage}
                                        name={FormField.interviewConsent}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <br />
                            <Grid justify="flex-end" container spacing={2}>
                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Create
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() =>
                                            handleReset(resetForm, setCroppedProfilePicture)
                                        }
                                        disabled={isSubmitting}
                                    >
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    </Grid>
                </Grid>
            )}
        </Formik>
    );
};

export default ClientForm;
