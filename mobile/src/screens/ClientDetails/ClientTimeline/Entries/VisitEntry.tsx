import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    apiFetch,
    Endpoint,
    IVisit,
    themeColors,
    timestampToDateTime,
    IVisitSummary,
    outcomeGoalMets,
    useZones,
    RiskType,
} from "@cbr/common";
import { riskTypes } from "../../../../util/riskIcon";
import { ActivityIndicator, Button, Card, Chip, Dialog, List, Text } from "react-native-paper";
import useStyles from "./Entry.styles";
import { ScrollView, View } from "react-native";
import * as Yup from "yup";
import { Formik, FormikProps } from "formik";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import DataCard from "../../../../components/DataCard/DataCard";

interface IEntryProps {
    visitSummary: IVisitSummary;
    close: () => void;
}

const VisitEntry = ({ visitSummary, close }: IEntryProps) => {
    const [open, setOpen] = useState(false);
    const [visit, setVisit] = useState<IVisit>();
    const [loadingError, setLoadingError] = useState(false);
    // const [loading, setLoading] = useState(false);

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
        close();
    };

    const zone = zones.get(visitSummary.zone) ?? "Unknown";

    const HealthChip = ({ label }: { label: string }) => (
        <View style={styles.referralChip}>
            <Chip style={styles.smallChip} mode="outlined" selectedColor={themeColors.blueBgDark}>
                {riskTypes.HEALTH.Icon(themeColors.riskBlack)} {label}
            </Chip>
        </View>
    );
    const EducationChip = ({ label }: { label: string }) => (
        <View style={styles.referralChip}>
            <Chip style={styles.smallChip} mode="outlined" selectedColor={themeColors.blueBgDark}>
                {riskTypes.EDUCAT.Icon(themeColors.riskBlack)} {label}
            </Chip>
        </View>
    );
    const SocialChip = ({ label }: { label: string }) => (
        <View style={styles.referralChip}>
            <Chip style={styles.smallChip} mode="outlined" selectedColor={themeColors.blueBgDark}>
                {riskTypes.SOCIAL.Icon(themeColors.riskBlack)} {label}
            </Chip>
        </View>
    );

    const Details = () => {
        useEffect(() => {
            onOpen();
        });

        if (!visit) {
            return <ActivityIndicator size="small" color={themeColors.blueAccent} />;
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
                <List.Accordion
                    key={type}
                    theme={{ colors: { background: themeColors.blueBgLight } }}
                    title={riskTypes[type].name}
                >
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
                            {"\n"}
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

    return (
        <ScrollView>
            <>
                <Dialog.Title>
                    Visit in {zone}
                    {"\n"}
                    {visitSummary.health_visit && <HealthChip label="Health" />}{" "}
                    {visitSummary.educat_visit && <EducationChip label="Education" />}{" "}
                    {visitSummary.social_visit && <SocialChip label="Social" />}{" "}
                </Dialog.Title>
                <Dialog.Content>
                    <Details />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose} color={themeColors.blueBgDark}>
                        Close
                    </Button>
                </Dialog.Actions>
            </>
        </ScrollView>
    );
};

export default VisitEntry;
