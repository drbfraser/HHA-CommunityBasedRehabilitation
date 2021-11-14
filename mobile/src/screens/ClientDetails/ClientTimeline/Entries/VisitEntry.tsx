import React, { useState, useEffect } from "react";
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
import DataCard from "../../../../components/DataCard/DataCard";
import { database } from "../../../../util/watermelonDatabase";

interface IEntryProps {
    visitSummary: IVisitSummary;
    close: () => void;
}

const VisitEntry = ({ visitSummary, close }: IEntryProps) => {
    const [visit, setVisit] = useState<any>();
    const [visitOutcomes, setVisitOutcome] = useState<any>();
    const [visitImprovements, setVisitImprovement] = useState<any>();
    let visitcreationDate;
    const onOpen = async () => {
        if (!visit) {
            const fetchedVisit: any = await database.get("visits").find(visitSummary.id);

            const fetchedOutcome = await fetchedVisit.outcomes.fetch();
            const fetchedImprov = await fetchedVisit.improvements.fetch();
            setVisitOutcome(fetchedOutcome);
            setVisitImprovement(fetchedImprov);
            setVisit(fetchedVisit);
        }
    };
    useEffect(() => {
        onOpen();
    }, []);

    const [loadingError, setLoadingError] = useState(false);

    const zones = useZones();
    const styles = useStyles();

    const onClose = () => {
        close();
    };

    const zone = zones.get(visitSummary.zone) ?? "Unknown";

    const SocialChip = ({ label, type }: { label: string; type: RiskType }) => (
        <View style={styles.visitChip}>
            <Chip style={styles.smallChip} mode="outlined" selectedColor={themeColors.blueBgDark}>
                {riskTypes[type].Icon(themeColors.riskBlack)} {label}
            </Chip>
        </View>
    );

    const Details = () => {
        if (!visit) {
            return <ActivityIndicator size="small" color={themeColors.blueAccent} />;
        }

        const DetailAccordion = ({ type }: { type: RiskType }) => {
            const improvements = visitImprovements
                .filter((i) => i.risk_type === type)
                .map((i) => ({
                    title: i.provided,
                    desc: i.desc,
                }));

            const outcomes = visitOutcomes
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
                    {...titleDescArr.join(" & ")}
                >
                    {improvements.length > 0 && <DataCard data={improvements} />}
                    {outcomes.length > 0 && <DataCard data={outcomes} />}
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
                            {timestampToDateTime(visit.createdAt)}
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
                    {visitSummary.health_visit && (
                        <SocialChip label="Health" type={RiskType.HEALTH} />
                    )}{" "}
                    {visitSummary.educat_visit && (
                        <SocialChip label="Education" type={RiskType.EDUCATION} />
                    )}{" "}
                    {visitSummary.social_visit && (
                        <SocialChip label="Social" type={RiskType.SOCIAL} />
                    )}{" "}
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
