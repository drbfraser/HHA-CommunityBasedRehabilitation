import React from "react";
import { useTranslation } from "react-i18next";
import { FormControl, FormGroup, FormLabel, MenuItem } from "@mui/material";
import { Field, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-mui";

import {
    visitFieldLabels,
    VisitFormField,
    OutcomeFormField,
    GoalStatus,
} from "@cbr/common/forms/newVisit/visitFormFields";
import { TZoneMap } from "@cbr/common/util/hooks/zones";
import { newVisitStyles } from "../NewVisit.styles";

const visitTypes: VisitFormField[] = [
    VisitFormField.health,
    VisitFormField.education,
    VisitFormField.social,
    VisitFormField.nutrition,
    VisitFormField.mental,
];

const VisitReasonStep = (
    formikProps: FormikProps<any>,
    setEnabledSteps: React.Dispatch<React.SetStateAction<VisitFormField[]>>,
    zones: TZoneMap
) => {
    const { t } = useTranslation();

    const onCheckboxChange = (checked: boolean, visitType: string) => {
        // We can't fully rely on formikProps.values[type] here because it might not be updated yet
        setEnabledSteps(
            visitTypes.filter(
                (type) =>
                    (formikProps.values[type] && type !== visitType) ||
                    (checked && type === visitType)
            )
        );

        if (checked) {
            formikProps.setFieldValue(`${VisitFormField.outcomes}.${visitType}`, {
                [OutcomeFormField.id]: "tmp",
                [OutcomeFormField.riskType]: visitType,
                [OutcomeFormField.goalStatus]: GoalStatus.ongoing,
                [OutcomeFormField.outcome]: "",
            });
        } else {
            formikProps.setFieldValue(`${VisitFormField.outcomes}.${visitType}`, undefined);
        }
    };
    return (
        <>
            <FormLabel focused={false}>{t("newVisit.whereVisit")}</FormLabel>
            <FormControl
                sx={newVisitStyles.visitLocationContainer}
                fullWidth
                required
                variant="outlined"
            >
                <Field
                    sx={newVisitStyles.visitLocation}
                    component={TextField}
                    name={VisitFormField.village}
                    label={visitFieldLabels[VisitFormField.village]}
                    variant="outlined"
                    fullWidth
                    required
                />
                <Field
                    sx={newVisitStyles.visitLocation}
                    component={TextField}
                    select
                    label={visitFieldLabels[VisitFormField.zone]}
                    name={VisitFormField.zone}
                    variant="outlined"
                    required
                >
                    {Array.from(zones).map(([id, name]) => (
                        <MenuItem key={id} value={id}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
            </FormControl>
            <br />
            <FormControl component="fieldset">
                <FormLabel focused={false}>{t("newVisit.selectReasons")}</FormLabel>
                <FormGroup>
                    {visitTypes.map((visitType) => (
                        <Field
                            component={CheckboxWithLabel}
                            type="checkbox"
                            key={visitType}
                            name={visitType}
                            Label={{ label: visitFieldLabels[visitType] }}
                            onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                formikProps.handleChange(event);
                                onCheckboxChange(event.currentTarget.checked, visitType);
                            }}
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </>
    );
};

export default VisitReasonStep;
