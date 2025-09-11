import React, { useState } from "react";
import { Field } from "formik";
import { TextField, MenuItem } from "@mui/material";

interface IModalDropdownProps {
    name: string;
    label: string;
    options: Record<string, string>;
    isCustom: boolean;
}

const ModalDropdown = ({ name, label, options, isCustom }: IModalDropdownProps) => {
    const [showOther, setShowOther] = useState(isCustom);

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
                    >
                        {Object.entries(options).map(([key, value]) => (
                            <MenuItem key={key} value={value}>
                                {value}
                            </MenuItem>
                        ))}
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>

                    {showOther && (
                        <TextField
                            fullWidth
                            multiline
                            variant="outlined"
                            margin="dense"
                            label=""
                            value={field.value || ""}
                            onChange={(e) => form.setFieldValue(name, e.target.value)}
                        />
                    )}
                </>
            )}
        </Field>
    );
};

export default ModalDropdown;
