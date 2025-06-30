import React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FormLabel, MenuItem, Typography } from "@mui/material";
import { useField, Field, useFormikContext } from "formik";
import { TextField } from "formik-mui";

import {
    visitFieldLabels,
    VisitFormField,
    OutcomeFormField,
    GoalStatus,
    getVisitGoalLabel,
    getVisitGoalStatusLabel,
} from "@cbr/common/forms/newVisit/visitFormFields";
import { IRisk, RiskType } from "@cbr/common/util/risks";

const OutcomeField = ({ visitType, risks }: { visitType: VisitFormField; risks: IRisk[] }) => {
    const { t } = useTranslation();
    const fieldName = `${VisitFormField.outcomes}.${visitType}`;
    const { setFieldValue } = useFormikContext<any>();
    const matchingRisk = risks.find(
        (risk) => risk.risk_type === (visitType as unknown as RiskType)
    );

    useEffect(() => {
        if (matchingRisk?.goal_status) {
            setFieldValue(`${fieldName}.${OutcomeFormField.goalStatus}`, matchingRisk.goal_status);
        }
    }, [matchingRisk, fieldName, setFieldValue]);

    return (
        <div>
            <FormLabel focused={false}>{getVisitGoalLabel(t, visitType)}</FormLabel>
            <Typography variant={"body1"}>{matchingRisk?.goal_name}</Typography>
            <br />

            <FormLabel focused={false}>{getVisitGoalStatusLabel(t, visitType)}</FormLabel>
            <br />
            <Field
                component={TextField}
                select
                required
                variant="outlined"
                name={`${fieldName}.${OutcomeFormField.goalStatus}`}
            >
                {Object.values(GoalStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                        {visitFieldLabels[status]}
                    </MenuItem>
                ))}
            </Field>
            <br />
            <br />
            <div>
                <FormLabel focused={false}>{t("newVisit.outcomeOfGoal")}</FormLabel>
                <Field
                    type="text"
                    component={TextField}
                    variant="outlined"
                    name={`${fieldName}.${OutcomeFormField.outcome}`}
                    label={visitFieldLabels[OutcomeFormField.outcome]}
                    required
                    fullWidth
                    multiline
                />
                <br />
            </div>
        </div>
    );
};

export default OutcomeField;
