import { handleNewClientSubmit, TClientValues } from "@cbr/common";
import { FormikHelpers } from "formik";
import React from "react";
import { StackScreenName } from "../../util/StackScreenName";

export const handleSubmit = async (
    values: TClientValues,
    helpers: FormikHelpers<TClientValues>,
    navigation
) => {
    helpers.setSubmitting(true);
    return handleNewClientSubmit(values, helpers).then((res) => {
        navigation.navigate(StackScreenName.CLIENT, {
            clientID: res.id,
        });
    });
};
