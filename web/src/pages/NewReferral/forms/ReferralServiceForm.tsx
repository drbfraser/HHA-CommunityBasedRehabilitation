import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { CheckboxWithLabel } from "formik-mui";
import { FormControl, FormGroup, FormLabel } from "@mui/material";

import {
    referralFieldLabels,
    ReferralFormField,
    serviceTypes,
} from "@cbr/common/forms/Referral/referralFields";

interface IFormProps {
    formikProps: FormikProps<any>;
}

const ReferralServiceForm = (
    props: IFormProps,
    setEnabledSteps: React.Dispatch<React.SetStateAction<ReferralFormField[]>>
) => {
    const { t } = useTranslation();

    const onCheckboxChange = (checked: boolean, selectedServiceType: string) => {
        // We can't fully rely on formikProps.values[service] here because it might not be updated yet
        setEnabledSteps(
            serviceTypes.filter(
                (serviceType) =>
                    (props.formikProps.values[serviceType] &&
                        serviceType !== selectedServiceType) ||
                    (checked && serviceType === selectedServiceType)
            )
        );
    };

    return (
        <FormControl component="fieldset">
            <FormLabel>{t("referral.selectReferralServices")}</FormLabel>
            <FormGroup>
                {serviceTypes.map((serviceType) => (
                    <Field
                        type="checkbox"
                        key={serviceType}
                        component={CheckboxWithLabel}
                        name={serviceType}
                        Label={{ label: referralFieldLabels[serviceType] }}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            props.formikProps.handleChange(event);
                            onCheckboxChange(event.currentTarget.checked, serviceType);
                        }}
                    />
                ))}
            </FormGroup>
        </FormControl>
    );
};

export default ReferralServiceForm;
