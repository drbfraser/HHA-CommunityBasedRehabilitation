import { handleSubmit } from "@cbr/common/forms/Risks/riskFormFieldHandler";
import { validationSchema } from "@cbr/common/forms/Risks/riskFormFields";
import { IRisk, RiskType } from "@cbr/common/util/risks";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

interface IModalProps {
    risk: IRisk;
    setRisk: (risk: IRisk) => void;
    close: () => void;
}

export default function UpdateGoalStatus(props: IModalProps) {
    const { t } = useTranslation();

    const getDialogTitleText = (riskType: RiskType): string => {
        switch (riskType) {
            case RiskType.HEALTH:
                return t("riskAttr.update_health");
            case RiskType.EDUCATION:
                return t("riskAttr.update_education");
            case RiskType.SOCIAL:
                return t("riskAttr.update_social");
            case RiskType.NUTRITION:
                return t("riskAttr.update_nutrition");
            case RiskType.MENTAL:
                return t("riskAttr.update_mental");
            default:
                console.error("Unknown risk type.");
                return "";
        }
    };

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
                            {getDialogTitleText(props.risk.risk_type)}
                            {/* <Stack direction="row" spacing={1}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Update Goal Status
                                </Typography>
                            </Stack> */}
                        </DialogTitle>
                        <DialogContent>
                            <FormControl>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Update Goal Status
                                </Typography>
                                {/* <FormLabel>Gender</FormLabel> */}
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel
                                        value="female"
                                        control={<Radio />}
                                        // TODO: Replace
                                        label="In Progress"
                                    />
                                    <FormControlLabel
                                        value="male"
                                        control={<Radio />}
                                        label="Goal Achieved"
                                    />
                                    <FormControlLabel
                                        value="other"
                                        control={<Radio />}
                                        label="Cancel Goal"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="outlined"
                                color="primary"
                                type="reset"
                                disabled={isSubmitting}
                                onClick={() => {
                                    props.close();
                                }}
                            >
                                {t("general.goBack")}
                            </Button>
                            <Button
                                color="success"
                                variant="outlined"
                                type="reset"
                                disabled={isSubmitting}
                            >
                                {t("general.save")}
                            </Button>
                        </DialogActions>
                    </Form>
                </Dialog>
            )}
        </Formik>
    );
}
