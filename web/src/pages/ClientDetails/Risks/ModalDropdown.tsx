import React, { useState } from "react";
import { Field } from "formik";
import { TextField, MenuItem } from "@mui/material";
import { RiskType, riskTypeKeyMap } from "@cbr/common/util/risks";
import { useTranslation } from "react-i18next";

interface IModalDropdownProps {
    name: string;
    modalType: string;
    requirementOrGoal: string;
    riskType: RiskType;
    label: string;
    options: Record<string, string>;
    isCustom: boolean;
    error?: string | false;
    touched?: boolean;
}

const ModalDropdown = ({
    name,
    modalType,
    requirementOrGoal,
    riskType,
    label,
    options,
    isCustom,
    error,
    touched,
}: IModalDropdownProps) => {
    const [showOther, setShowOther] = useState(isCustom);
    const { t } = useTranslation();
    const risk_type = riskTypeKeyMap[riskType];
    const modal_type = modalType === "risk" ? "risk" : "cancellation";

    return (
        <Field name={name}>
            {({ field, form }: any) => (
                <>
                    <TextField
                        select
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        label={label}
                        value={showOther ? "Other" : field.value || ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "Other") {
                                setShowOther(true);
                                form.setFieldValue(name, "");
                            } else {
                                setShowOther(false);
                                form.setFieldValue(name, val);
                            }
                        }}
                        error={!showOther && Boolean(error && touched)}
                        helperText={!showOther && touched && error}
                    >
                        {Object.entries(options).map(([key, value]) => (
                            <MenuItem key={key} value={key}>
                                {modal_type === "risk"
                                    ? t(`risk.${risk_type}.${requirementOrGoal}.${key}`, {
                                          defaultValue: value,
                                      })
                                    : t(`cancellation.${key}`, { defaultValue: value })}
                            </MenuItem>
                        ))}
                        <MenuItem value="Other">{t("disabilities.other")}</MenuItem>
                    </TextField>

                    {showOther && (
                        <TextField
                            fullWidth
                            multiline
                            variant="outlined"
                            margin="dense"
                            label={field.value === "" ? "Please specify" : ""}
                            value={field.value || ""}
                            onChange={(e) => form.setFieldValue(name, e.target.value)}
                            error={Boolean(error && touched)}
                            helperText={touched && error}
                        />
                    )}
                </>
            )}
        </Field>
    );
};

export default ModalDropdown;
