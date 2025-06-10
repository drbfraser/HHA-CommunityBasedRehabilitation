import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, styled } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";

export interface IDateRange {
    from: string;
    to: string;
}

export const blankDateRange: IDateRange = {
    from: "",
    to: "",
};

const StyledDialogContent = styled(DialogContent)({
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
});

interface IProps {
    open: boolean;
    onClose: () => void;
    range: IDateRange;
    setRange: (range: IDateRange) => void;
}

const StatsDateFilter = ({ open, onClose, range, setRange }: IProps) => {
    const { t } = useTranslation();

    const handleSubmit = (values: IDateRange) => {
        setRange({ ...values });
        onClose();
    };
    const handleClear = () => {
        setRange({ ...blankDateRange });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{t("statistics.filterByDate")}</DialogTitle>

            <Formik initialValues={range} onSubmit={handleSubmit}>
                <Form>
                    <StyledDialogContent>
                        <Field
                            name="from"
                            label={t("general.from")}
                            type="date"
                            variant="outlined"
                            required
                            component={TextField}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Field
                            name="to"
                            label={t("general.to")}
                            type="date"
                            variant="outlined"
                            required
                            component={TextField}
                            InputLabelProps={{ shrink: true }}
                        />
                    </StyledDialogContent>

                    <DialogActions>
                        <Button onClick={handleClear}>{t("general.clear")}</Button>
                        <Button color="primary" type="submit">
                            {t("general.filter")}
                        </Button>
                    </DialogActions>
                </Form>
            </Formik>
        </Dialog>
    );
};

export default StatsDateFilter;
