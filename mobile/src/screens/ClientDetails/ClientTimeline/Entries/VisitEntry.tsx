import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    apiFetch,
    Endpoint,
    IVisit,
    orthoticInjuryLocations,
    prostheticInjuryLocations,
    themeColors,
    timestampToDateTime,
    wheelchairExperiences,
    IVisitSummary,
    outcomeGoalMets,
    useZones,
} from "@cbr/common";
import {
    ActivityIndicator,
    Button,
    Card,
    Chip,
    Dialog,
    HelperText,
    List,
    Text,
    TextInput,
} from "react-native-paper";
import useStyles from "./Entry.styles";
import { ScrollView, View } from "react-native";
import * as Yup from "yup";
import { Formik, FormikProps } from "formik";

interface IEntryProps {
    visitSummary: IVisitSummary;
    refreshClient: () => void;
}

const VisitEntry = ({ visitSummary, refreshClient }: IEntryProps) => {
    const [open, setOpen] = useState(false);
    const [visit, setVisit] = useState<IVisit>();
    const [loadingError, setLoadingError] = useState(false);
    const zones = useZones();
    const styles = useStyles();

    const onOpen = () => {
        setOpen(true);

        if (!visit) {
            apiFetch(Endpoint.VISIT, `${visitSummary.id}`)
                .then((resp) => resp.json())
                .then((resp) => setVisit(resp as IVisit))
                .catch(() => setLoadingError(true));
        }
    };

    const onClose = () => {
        setOpen(false);
        setLoadingError(false);
    };
};
