import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    styled,
    Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { Field, Form, Formik } from "formik";
import { TextField as FormikTextField } from "formik-mui";
import React, { SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";

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
    const [accordianExpanded, setExpanded] = useState<string | false>("byMonth");

    const handleSubmit = (values: IDateRange) => {
        setRange({ ...values });
        onClose();
    };

    const handleClear = () => {
        setRange({ ...blankDateRange });
        onClose();
    };

    const handleAccordianChange =
        (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{t("statistics.filterByDate")}</DialogTitle>
            <Formik initialValues={range} onSubmit={handleSubmit} enableReinitialize={true}>
                {({ values, setFieldValue, resetForm }) => (
                    <Form>
                        <StyledDialogContent>
                            <Accordion
                                expanded={accordianExpanded === "byMonth"}
                                onChange={handleAccordianChange("byMonth")}
                            >
                                <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
                                    <Typography>{t("statistics.monthly")}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            disableFuture
                                            label="By Month"
                                            openTo="year"
                                            views={["year", "month"]}
                                            value={values.from ? dayjs(values.from) : null}
                                            onChange={(newValue) => {
                                                if (newValue) {
                                                    const start = newValue
                                                        .clone()
                                                        .startOf("month")
                                                        .format("YYYY-MM-DD");
                                                    const end = newValue
                                                        .clone()
                                                        .endOf("month")
                                                        .format("YYYY-MM-DD");
                                                    setFieldValue("from", start);
                                                    setFieldValue("to", end);
                                                } else {
                                                    setFieldValue("from", "");
                                                    setFieldValue("to", "");
                                                }
                                            }}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </LocalizationProvider>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                expanded={accordianExpanded === "specific"}
                                onChange={handleAccordianChange("specific")}
                            >
                                <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
                                    <Typography>{t("statistics.specificDate")}</Typography>
                                </AccordionSummary>

                                <StyledDialogContent>
                                    <Field
                                        name="from"
                                        label={t("general.from")}
                                        type="date"
                                        variant="outlined"
                                        required={accordianExpanded === "specific"}
                                        component={FormikTextField}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <Field
                                        name="to"
                                        label={t("general.to")}
                                        type="date"
                                        variant="outlined"
                                        required={accordianExpanded === "specific"}
                                        component={FormikTextField}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </StyledDialogContent>
                            </Accordion>
                        </StyledDialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    resetForm({ values: blankDateRange });
                                    handleClear();
                                }}
                            >
                                {t("general.clear")}
                            </Button>
                            <Button color="primary" type="submit">
                                {t("general.filter")}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default StatsDateFilter;
