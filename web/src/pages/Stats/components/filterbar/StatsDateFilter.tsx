import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
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

const StyledContent = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
});

interface IProps {
    range: IDateRange;
    setRange: (range: IDateRange) => void;
}

const StatsDateFilter = ({ range, setRange }: IProps) => {
    const { t } = useTranslation();
    const [accordionExpanded, setExpanded] = useState<string | false>("byMonth");

    const handleSubmit = (values: IDateRange) => {
        setRange({ ...values });
    };

    const handleClear = (resetForm: (args?: any) => void) => {
        resetForm({ values: blankDateRange });
        setRange({ ...blankDateRange });
    };

    const handleAccordionChange = (panel: string) => (_: SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Formik initialValues={range} onSubmit={handleSubmit} enableReinitialize>
            {({ values, setFieldValue, resetForm }) => (
                <Form>
                    <StyledContent>
                        {/* Month filter */}
                        <Accordion
                            expanded={accordionExpanded === "byMonth"}
                            onChange={handleAccordionChange("byMonth")}
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

                        {/* Specific date filter */}
                        <Accordion
                            expanded={accordionExpanded === "specific"}
                            onChange={handleAccordionChange("specific")}
                        >
                            <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
                                <Typography>{t("statistics.specificDate")}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <StyledContent>
                                    <Field
                                        name="from"
                                        label={t("general.from")}
                                        type="date"
                                        variant="outlined"
                                        required={accordionExpanded === "specific"}
                                        component={FormikTextField}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ max: values.to || undefined }}
                                    />
                                    <Field
                                        name="to"
                                        label={t("general.to")}
                                        type="date"
                                        variant="outlined"
                                        required={accordionExpanded === "specific"}
                                        component={FormikTextField}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ min: values.from || undefined }}
                                    />
                                </StyledContent>
                            </AccordionDetails>
                        </Accordion>

                        {/* Buttons */}
                        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                            <Button onClick={() => handleClear(resetForm)}>
                                {t("general.clear")}
                            </Button>
                            <Button color="primary" type="submit" variant="contained">
                                {t("general.filter")}
                            </Button>
                        </Box>
                    </StyledContent>
                </Form>
            )}
        </Formik>
    );
};

export default StatsDateFilter;
