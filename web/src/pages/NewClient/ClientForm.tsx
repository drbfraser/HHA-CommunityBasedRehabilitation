import React from "react";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-mui";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    FormControl,
    Grid,
    MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    clientFieldLabels,
    ClientField,
    clientInitialValues,
    newClientValidationSchema,
} from "@cbr/common/forms/Client/clientFields";
import { riskDropdownOptions, riskLevels, RiskType, riskTypeKeyMap } from "@cbr/common/util/risks";
import { HCRType, genders } from "@cbr/common/util/clients";
import { getOtherDisabilityId, useDisabilities } from "@cbr/common/util/hooks/disabilities";
import { useZones } from "@cbr/common/util/hooks/zones";
import { ProfilePicCard } from "components/PhotoViewUpload/PhotoViewUpload";
import { handleNewWebClientSubmit, handleReset } from "@cbr/common/forms/Client/clientHandler";
import { clientFormStyles } from "./ClientForm.styles";
import ModalDropdown from "pages/ClientDetails/Risks/ModalDropdown";

const ClientForm = () => {
    const zones = useZones();
    const { t } = useTranslation();
    const disabilities = useDisabilities(t);

    return (
        <Formik
            initialValues={clientInitialValues}
            validationSchema={newClientValidationSchema}
            onSubmit={handleNewWebClientSubmit}
        >
            {({ values, isSubmitting, resetForm, touched, setFieldValue, errors, submitCount }) => (
                <Grid container direction="row" justifyContent="flex-start" spacing={2}>
                    <Grid item md={12} xs={12}>
                        <Field
                            component={CheckboxWithLabel}
                            color="secondary"
                            type="checkbox"
                            name={ClientField.interviewConsent}
                            Label={{ label: clientFieldLabels[ClientField.interviewConsent] }}
                        />
                    </Grid>
                    {values.interviewConsent ? (
                        <>
                            <Grid item md={2} xs={12}>
                                <ProfilePicCard
                                    isEditing={true}
                                    onPictureChange={(newPictureURL) => {
                                        setFieldValue(ClientField.picture, newPictureURL);
                                        setFieldValue(ClientField.pictureChanged, true);
                                    }}
                                    picture={values.picture}
                                />
                            </Grid>
                            <Grid item md={10} xs={12}>
                                <Form>
                                    <Grid container spacing={2}>
                                        <Grid item md={6} xs={12}>
                                            <Field
                                                component={TextField}
                                                name={ClientField.firstName}
                                                variant="outlined"
                                                label={clientFieldLabels[ClientField.firstName]}
                                                required
                                                fullWidth
                                                autoComplete="off"
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Field
                                                component={TextField}
                                                name={ClientField.lastName}
                                                variant="outlined"
                                                label={clientFieldLabels[ClientField.lastName]}
                                                required
                                                fullWidth
                                                autoComplete="off"
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
                                                label={clientFieldLabels[ClientField.birthDate]}
                                                name={ClientField.birthDate}
                                                autoComplete="off"
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
                                                    label={clientFieldLabels[ClientField.gender]}
                                                    name={ClientField.gender}
                                                    autoComplete="off"
                                                >
                                                    {Object.entries(genders).map(
                                                        ([value, name]) => (
                                                            <MenuItem key={value} value={value}>
                                                                {name}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Field>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Field
                                                component={TextField}
                                                variant="outlined"
                                                name={ClientField.village}
                                                label={clientFieldLabels[ClientField.village]}
                                                required
                                                fullWidth
                                                autoComplete="off"
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
                                                    label={clientFieldLabels[ClientField.hcrType]}
                                                    name={ClientField.hcrType}
                                                    autoComplete="off"
                                                >
                                                    <MenuItem value={HCRType.HOST_COMMUNITY}>
                                                        {t("clientFields.hostCommunity")}
                                                    </MenuItem>
                                                    <MenuItem value={HCRType.REFUGEE}>
                                                        {t("clientFields.refugee")}
                                                    </MenuItem>
                                                </Field>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <FormControl fullWidth variant="outlined">
                                                <Field
                                                    component={TextField}
                                                    fullWidth
                                                    select
                                                    variant="outlined"
                                                    required
                                                    label={clientFieldLabels[ClientField.zone]}
                                                    defaultValue=""
                                                    name={ClientField.zone}
                                                    autoComplete="off"
                                                >
                                                    {Array.from(zones)
                                                        .sort((a, b) => a[1].localeCompare(b[1]))
                                                        .map(([id, name]) => (
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
                                                name={ClientField.phoneNumber}
                                                variant="outlined"
                                                label={clientFieldLabels[ClientField.phoneNumber]}
                                                fullWidth
                                                autoComplete="off"
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
                                                label={clientFieldLabels[ClientField.disability]}
                                                required
                                                name={ClientField.disability}
                                                variant="outlined"
                                                autoComplete="off"
                                            >
                                                {Array.from(disabilities).map(([id, name]) => (
                                                    <MenuItem key={id} value={id}>
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </Field>
                                            {(values[ClientField.disability] as number[]).includes(
                                                getOtherDisabilityId(disabilities)
                                            ) && (
                                                <div>
                                                    <br />
                                                    <Field
                                                        component={TextField}
                                                        fullWidth
                                                        label={
                                                            clientFieldLabels[
                                                                ClientField.otherDisability
                                                            ]
                                                        }
                                                        required
                                                        name={ClientField.otherDisability}
                                                        variant="outlined"
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            )}
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Field
                                                component={CheckboxWithLabel}
                                                type="checkbox"
                                                color="secondary"
                                                name={ClientField.caregiverPresent}
                                                Label={{
                                                    label: clientFieldLabels[
                                                        ClientField.caregiverPresent
                                                    ],
                                                }}
                                            />
                                        </Grid>
                                        {values.caregiverPresent ? (
                                            <Grid item md={7} xs={12}>
                                                <Accordion
                                                    sx={clientFormStyles.caregiverAccordion}
                                                    defaultExpanded
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                    >
                                                        {t("clientFields.caregiverDetails")}
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Grid
                                                            container
                                                            direction="column"
                                                            spacing={1}
                                                        >
                                                            <Grid item md={8} xs={12}>
                                                                <Field
                                                                    sx={
                                                                        clientFormStyles.caregiverInputField
                                                                    }
                                                                    component={TextField}
                                                                    name={ClientField.caregiverName}
                                                                    variant="outlined"
                                                                    label={
                                                                        clientFieldLabels[
                                                                            ClientField
                                                                                .caregiverName
                                                                        ]
                                                                    }
                                                                    fullWidth
                                                                    autoComplete="off"
                                                                />
                                                            </Grid>
                                                            <Grid item md={8} xs={12}>
                                                                <Field
                                                                    sx={{
                                                                        ...clientFormStyles.caregiverInputField,
                                                                        ...clientFormStyles.disabledTextField,
                                                                    }}
                                                                    component={TextField}
                                                                    name={
                                                                        ClientField.caregiverEmail
                                                                    }
                                                                    variant="outlined"
                                                                    label={
                                                                        clientFieldLabels[
                                                                            ClientField
                                                                                .caregiverEmail
                                                                        ]
                                                                    }
                                                                    fullWidth
                                                                    autoComplete="off"
                                                                />
                                                            </Grid>
                                                            <Grid item md={8} xs={12}>
                                                                <Field
                                                                    sx={
                                                                        clientFormStyles.caregiverInputField
                                                                    }
                                                                    component={TextField}
                                                                    name={
                                                                        ClientField.caregiverPhone
                                                                    }
                                                                    variant="outlined"
                                                                    label={
                                                                        clientFieldLabels[
                                                                            ClientField
                                                                                .caregiverPhone
                                                                        ]
                                                                    }
                                                                    fullWidth
                                                                    autoComplete="off"
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </Grid>
                                        ) : (
                                            <></>
                                        )}
                                    </Grid>

                                    <Grid item md={12} xs={12}>
                                        <hr />
                                    </Grid>
                                    <Grid container spacing={0}>
                                        <Grid item md={12} xs={12}>
                                            <Field
                                                component={CheckboxWithLabel}
                                                type="checkbox"
                                                color="secondary"
                                                name={ClientField.healthChecked}
                                                Label={{
                                                    label: clientFieldLabels[
                                                        ClientField.healthRisk
                                                    ],
                                                }}
                                            />
                                        </Grid>
                                        {values.healthChecked ? (
                                            <>
                                                <Grid item md={6} xs={12}>
                                                    <FormControl fullWidth variant="outlined">
                                                        <Field
                                                            component={TextField}
                                                            select
                                                            variant="outlined"
                                                            label={
                                                                clientFieldLabels[
                                                                    ClientField.healthRisk
                                                                ]
                                                            }
                                                            name={ClientField.healthRisk}
                                                            autoComplete="off"
                                                            error={
                                                                errors.healthRisk &&
                                                                touched.healthRisk
                                                            }
                                                        >
                                                            {Object.entries(riskLevels)
                                                                .filter(
                                                                    ([_, { isDropDownOption }]) =>
                                                                        isDropDownOption
                                                                )
                                                                .map(([value, { name }]) => (
                                                                    <MenuItem
                                                                        key={value}
                                                                        value={value}
                                                                    >
                                                                        {name}
                                                                    </MenuItem>
                                                                ))}
                                                        </Field>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={8} xs={12}>
                                                    <ModalDropdown
                                                        name={ClientField.healthRequirements}
                                                        modalType="risk"
                                                        requirementOrGoal="requirement"
                                                        riskType={RiskType.HEALTH}
                                                        label={
                                                            clientFieldLabels[
                                                                ClientField.healthRequirements
                                                            ]
                                                        }
                                                        options={
                                                            riskDropdownOptions[
                                                                riskTypeKeyMap[RiskType.HEALTH]
                                                            ]?.requirement || {}
                                                        }
                                                        isCustom={false}
                                                        error={errors.healthRequirements}
                                                        touched={touched.healthRequirements}
                                                    />
                                                </Grid>
                                                <Grid item md={8} xs={12}>
                                                    <ModalDropdown
                                                        name={ClientField.healthGoals}
                                                        modalType="risk"
                                                        requirementOrGoal="goal"
                                                        riskType={RiskType.HEALTH}
                                                        label={
                                                            clientFieldLabels[
                                                                ClientField.healthGoals
                                                            ]
                                                        }
                                                        options={
                                                            riskDropdownOptions[
                                                                riskTypeKeyMap[RiskType.HEALTH]
                                                            ]?.goal || {}
                                                        }
                                                        isCustom={false}
                                                        error={errors.healthGoals}
                                                        touched={touched.healthGoals}
                                                    />
                                                </Grid>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        <Grid item md={12} xs={12}>
                                            <Field
                                                component={CheckboxWithLabel}
                                                type="checkbox"
                                                color="secondary"
                                                name={ClientField.educationChecked}
                                                Label={{
                                                    label: clientFieldLabels[
                                                        ClientField.educationRisk
                                                    ],
                                                }}
                                            />
                                        </Grid>
                                        {values.educationChecked ? (
                                            <>
                                                <Grid item md={6} xs={12}>
                                                    <FormControl fullWidth variant="outlined">
                                                        <Field
                                                            component={TextField}
                                                            select
                                                            variant="outlined"
                                                            label={
                                                                clientFieldLabels[
                                                                    ClientField.educationRisk
                                                                ]
                                                            }
                                                            name={ClientField.educationRisk}
                                                            autoComplete="off"
                                                            error={
                                                                errors.educationRisk &&
                                                                touched.educationRisk
                                                            }
                                                        >
                                                            {Object.entries(riskLevels)
                                                                .filter(
                                                                    ([_, { isDropDownOption }]) =>
                                                                        isDropDownOption
                                                                )
                                                                .map(([value, { name }]) => (
                                                                    <MenuItem
                                                                        key={value}
                                                                        value={value}
                                                                    >
                                                                        {name}
                                                                    </MenuItem>
                                                                ))}
                                                        </Field>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={8} xs={12}>
                                                    <ModalDropdown
                                                        name={ClientField.educationRequirements}
                                                        modalType="risk"
                                                        requirementOrGoal="requirement"
                                                        riskType={RiskType.EDUCATION}
                                                        label={
                                                            clientFieldLabels[
                                                                ClientField.educationRequirements
                                                            ]
                                                        }
                                                        options={
                                                            riskDropdownOptions[
                                                                riskTypeKeyMap[RiskType.EDUCATION]
                                                            ]?.requirement || {}
                                                        }
                                                        isCustom={false}
                                                        error={errors.educationRequirements}
                                                        touched={touched.educationRequirements}
                                                    />
                                                </Grid>
                                                <Grid item md={8} xs={12}>
                                                    <ModalDropdown
                                                        name={ClientField.educationGoals}
                                                        modalType="risk"
                                                        requirementOrGoal="goal"
                                                        riskType={RiskType.EDUCATION}
                                                        label={
                                                            clientFieldLabels[
                                                                ClientField.educationGoals
                                                            ]
                                                        }
                                                        options={
                                                            riskDropdownOptions[
                                                                riskTypeKeyMap[RiskType.EDUCATION]
                                                            ]?.goal || {}
                                                        }
                                                        isCustom={false}
                                                        error={errors.educationGoals}
                                                        touched={touched.educationGoals}
                                                    />
                                                </Grid>{" "}
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        <Grid item md={12} xs={12}>
                                            <Field
                                                component={CheckboxWithLabel}
                                                type="checkbox"
                                                color="secondary"
                                                name={ClientField.socialChecked}
                                                Label={{
                                                    label: clientFieldLabels[
                                                        ClientField.socialRisk
                                                    ],
                                                }}
                                            />
                                        </Grid>
                                        {values.socialChecked ? (
                                            <>
                                                <Grid item md={6} xs={12}>
                                                    <FormControl fullWidth variant="outlined">
                                                        <Field
                                                            component={TextField}
                                                            select
                                                            variant="outlined"
                                                            label={
                                                                clientFieldLabels[
                                                                    ClientField.socialRisk
                                                                ]
                                                            }
                                                            name={ClientField.socialRisk}
                                                            autoComplete="off"
                                                        >
                                                            {Object.entries(riskLevels)
                                                                .filter(
                                                                    ([_, { isDropDownOption }]) =>
                                                                        isDropDownOption
                                                                )
                                                                .map(([value, { name }]) => (
                                                                    <MenuItem
                                                                        key={value}
                                                                        value={value}
                                                                    >
                                                                        {name}
                                                                    </MenuItem>
                                                                ))}
                                                        </Field>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item md={8} xs={12}>
                                                    <ModalDropdown
                                                        name={ClientField.socialRequirements}
                                                        modalType="risk"
                                                        requirementOrGoal="requirement"
                                                        riskType={RiskType.SOCIAL}
                                                        label={
                                                            clientFieldLabels[
                                                                ClientField.socialRequirements
                                                            ]
                                                        }
                                                        options={
                                                            riskDropdownOptions[
                                                                riskTypeKeyMap[RiskType.SOCIAL]
                                                            ]?.requirement || {}
                                                        }
                                                        isCustom={false}
                                                        error={errors.socialRequirements}
                                                        touched={touched.socialRequirements}
                                                    />
                                                </Grid>
                                                <Grid item md={8} xs={12}>
                                                    <ModalDropdown
                                                        name={ClientField.socialGoals}
                                                        modalType="risk"
                                                        requirementOrGoal="goal"
                                                        riskType={RiskType.SOCIAL}
                                                        label={
                                                            clientFieldLabels[
                                                                ClientField.socialGoals
                                                            ]
                                                        }
                                                        options={
                                                            riskDropdownOptions[
                                                                riskTypeKeyMap[RiskType.SOCIAL]
                                                            ]?.goal || {}
                                                        }
                                                        isCustom={false}
                                                        error={errors.socialGoals}
                                                        touched={touched.socialGoals}
                                                    />
                                                </Grid>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        <Grid item md={12} xs={12}>
                                            <Field
                                                component={CheckboxWithLabel}
                                                type="checkbox"
                                                color="secondary"
                                                name={ClientField.nutritionChecked}
                                                Label={{
                                                    label: clientFieldLabels[
                                                        ClientField.nutritionRisk
                                                    ],
                                                }}
                                            />
                                        </Grid>

                                        {values.nutritionChecked ? (
                                            <>
                                                <Grid item md={6} xs={12}>
                                                    <FormControl fullWidth variant="outlined">
                                                        <Field
                                                            component={TextField}
                                                            select
                                                            variant="outlined"
                                                            label={
                                                                clientFieldLabels[
                                                                    ClientField.nutritionRisk
                                                                ]
                                                            }
                                                            name={ClientField.nutritionRisk}
                                                            autoComplete="off"
                                                        >
                                                            {Object.entries(riskLevels)
                                                                .filter(
                                                                    ([_, { isDropDownOption }]) =>
                                                                        isDropDownOption
                                                                )
                                                                .map(([value, { name }]) => (
                                                                    <MenuItem
                                                                        key={value}
                                                                        value={value}
                                                                    >
                                                                        {name}
                                                                    </MenuItem>
                                                                ))}
                                                        </Field>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item md={8} xs={12}>
                                                    <ModalDropdown
                                                        name={ClientField.nutritionRequirements}
                                                        modalType="risk"
                                                        requirementOrGoal="requirement"
                                                        riskType={RiskType.NUTRITION}
                                                        label={
                                                            clientFieldLabels[
                                                                ClientField.nutritionRequirements
                                                            ]
                                                        }
                                                        options={
                                                            riskDropdownOptions[
                                                                riskTypeKeyMap[RiskType.NUTRITION]
                                                            ]?.requirement || {}
                                                        }
                                                        isCustom={false}
                                                        error={errors.nutritionRequirements}
                                                        touched={touched.nutritionRequirements}
                                                    />
                                                </Grid>
                                                <Grid item md={8} xs={12}>
                                                    <ModalDropdown
                                                        name={ClientField.nutritionGoals}
                                                        modalType="risk"
                                                        requirementOrGoal="goal"
                                                        riskType={RiskType.NUTRITION}
                                                        label={
                                                            clientFieldLabels[
                                                                ClientField.nutritionGoals
                                                            ]
                                                        }
                                                        options={
                                                            riskDropdownOptions[
                                                                riskTypeKeyMap[RiskType.NUTRITION]
                                                            ]?.goal || {}
                                                        }
                                                        isCustom={false}
                                                        error={errors.nutritionGoals}
                                                        touched={touched.nutritionGoals}
                                                    />
                                                </Grid>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        <Grid item md={12} xs={12}>
                                            <Field
                                                component={CheckboxWithLabel}
                                                type="checkbox"
                                                color="secondary"
                                                name={ClientField.mentalChecked}
                                                Label={{
                                                    label: clientFieldLabels[
                                                        ClientField.mentalRisk
                                                    ],
                                                }}
                                            />
                                        </Grid>

                                        {values.mentalChecked ? (
                                            <>
                                                <Grid item md={6} xs={12}>
                                                    <FormControl fullWidth variant="outlined">
                                                        <Field
                                                            component={TextField}
                                                            select
                                                            variant="outlined"
                                                            label={
                                                                clientFieldLabels[
                                                                    ClientField.mentalRisk
                                                                ]
                                                            }
                                                            name={ClientField.mentalRisk}
                                                            autoComplete="off"
                                                        >
                                                            {Object.entries(riskLevels)
                                                                .filter(
                                                                    ([_, { isDropDownOption }]) =>
                                                                        isDropDownOption
                                                                )
                                                                .map(([value, { name }]) => (
                                                                    <MenuItem
                                                                        key={value}
                                                                        value={value}
                                                                    >
                                                                        {name}
                                                                    </MenuItem>
                                                                ))}
                                                        </Field>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item md={8} xs={12}>
                                                    <ModalDropdown
                                                        name={ClientField.mentalRequirements}
                                                        modalType="risk"
                                                        requirementOrGoal="requirement"
                                                        riskType={RiskType.MENTAL}
                                                        label={
                                                            clientFieldLabels[
                                                                ClientField.mentalRequirements
                                                            ]
                                                        }
                                                        options={
                                                            riskDropdownOptions[
                                                                riskTypeKeyMap[RiskType.MENTAL]
                                                            ]?.requirement || {}
                                                        }
                                                        isCustom={false}
                                                        error={errors.mentalRequirements}
                                                        touched={touched.mentalRequirements}
                                                    />
                                                </Grid>
                                                <Grid item md={8} xs={12}>
                                                    <ModalDropdown
                                                        name={ClientField.mentalGoals}
                                                        modalType="risk"
                                                        requirementOrGoal="goal"
                                                        riskType={RiskType.MENTAL}
                                                        label={
                                                            clientFieldLabels[
                                                                ClientField.mentalGoals
                                                            ]
                                                        }
                                                        options={
                                                            riskDropdownOptions[
                                                                riskTypeKeyMap[RiskType.MENTAL]
                                                            ]?.goal || {}
                                                        }
                                                        isCustom={false}
                                                        error={errors.mentalGoals}
                                                        touched={touched.mentalGoals}
                                                    />
                                                </Grid>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        <br />
                                        <Grid
                                            // todo: what is the purpose of this?  not displaying anything in either case
                                            item
                                            md={12}
                                            xs={12}
                                            sx={
                                                !values.interviewConsent && touched.interviewConsent
                                                    ? clientFormStyles.checkboxError
                                                    : {}
                                            }
                                        ></Grid>
                                    </Grid>
                                    <br />
                                    <br />
                                    <Grid
                                        justifyContent="flex-end"
                                        container
                                        spacing={2}
                                        alignItems="center"
                                    >
                                        {errors.hasRisk && submitCount > 0 && (
                                            <Grid sx={clientFormStyles.riskFieldsError} item>
                                                {errors.hasRisk}
                                            </Grid>
                                        )}
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
                                                onClick={() => handleReset(resetForm)}
                                                disabled={isSubmitting}
                                            >
                                                Clear
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Form>
                            </Grid>
                        </>
                    ) : (
                        <></>
                    )}
                </Grid>
            )}
        </Formik>
    );
};

export default ClientForm;
