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
    RiskType,
    riskTypes,
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
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import DataCard from "../../../../components/DataCard/DataCard";

interface IEntryProps {
    visitSummary: IVisitSummary;
    refreshClient: () => void;
}

const VisitEntry = ({ visitSummary, refreshClient }: IEntryProps) => {
    const [open, setOpen] = useState(false);
    const [visit, setVisit] = useState<IVisit>();
    const [loadingError, setLoadingError] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const handleUpdate = () => {
        setLoading(false);
        refreshClient();
    };

    const zone = zones.get(visitSummary.zone) ?? "Unknown";
    const ReasonChip = ({ label }: { label: string }) => (
        <View style={styles.referralChip}>
            <Chip style={styles.smallChip} mode="outlined" selectedColor={themeColors.blueBgDark}>
                {label}
            </Chip>
        </View>
    );

    const Details = () => {
        if (!visit) {
            return (
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item height={200} />
                </SkeletonPlaceholder>
            );
        }

        const DetailAccordion = ({ type }: { type: RiskType }) => {
            const improvements = visit.improvements
                .filter((i) => i.risk_type === type)
                .map((i) => ({
                    title: i.provided,
                    desc: i.desc,
                }));

            const outcomes = visit.outcomes
                .filter((o) => o.risk_type === type)
                .map((o) => ({
                    title: outcomeGoalMets[o.goal_met].name,
                    desc: o.outcome,
                }));

            if (!improvements.length && !outcomes.length) {
                return <React.Fragment key={type} />;
            }

            let titleDescArr: string[] = [];

            if (improvements.length) {
                titleDescArr.push("Improvements");
            }

            if (outcomes.length) {
                titleDescArr.push("Outcomes");
            }

            return (
                <List.Accordion key={type} title={riskTypes[type].name}>
                    {Boolean(improvements.length) && <DataCard data={improvements} />}
                    {Boolean(outcomes.length) && <DataCard data={outcomes} />}
                </List.Accordion>
            );
        };

        return (
            <>
                <Card.Title title="New Visit Survey" />

                <Card style={styles.createdCard}>
                    <Card.Content>
                        <Text>
                            <Text style={styles.labelBold}>Visit Date:</Text>{" "}
                            {timestampToDateTime(visit.date_visited)}
                            <Text style={styles.labelBold}>Village:</Text> {visit.village}
                        </Text>
                    </Card.Content>
                </Card>
                {Object.values(RiskType).map((type) => (
                    <DetailAccordion key={type} type={type} />
                ))}
            </>
        );
    };
};

export default VisitEntry;
