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
import { modelName } from "../../../../models/constant";
import { useTranslation } from "react-i18next";

interface IEntryProps {
    visitSummary: IVisitSummary;
    close: () => void;
}

const VisitEntry = ({ visitSummary, close }: IEntryProps) => {
    const [visit, setVisit] = useState<IVisit>();
    const [visitOutcomes, setVisitOutcome] = useState<any>();
    const [visitImprovements, setVisitImprovement] = useState<any>();
    const { t } = useTranslation();

    const onOpen = async () => {
        if (!visit) {
            const fetchedVisit: any = await database.get(modelName.visits).find(visitSummary.id);
            const iVisit: IVisit = {
                id: fetchedVisit.id,
                user_id: fetchedVisit.user_id, // Value in fetchVisit, but undefined in iVisit. Why?
                client_id: fetchedVisit.client_id, // Value in fetchVisit, but undefined in iVisit. Why?
                created_at: fetchedVisit.createdAt,
                health_visit: fetchedVisit.health_visit,
                educat_visit: fetchedVisit.educat_visit,
                social_visit: fetchedVisit.social_visit,
                nutrit_visit: fetchedVisit.nutrit_visit,
                mental_visit: fetchedVisit.mental_visit,
                longitude: fetchedVisit.longitude,
                latitude: fetchedVisit.latitude,
                zone: fetchedVisit.zone,
                village: fetchedVisit.village,
                improvements: [],
                outcomes: [],
            };
            const fetchedOutcome = await fetchedVisit.outcomes.fetch();
            const fetchedImprov = await fetchedVisit.improvements.fetch();
            setVisitOutcome(fetchedOutcome);
            setVisitImprovement(fetchedImprov);
            setVisit(iVisit);
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
                <Card style={styles.createdCard}>
                    <Card.Content>
                        <Text>
                            <Text style={styles.labelBold}>{t("visitAttr.date")}:</Text>{" "}
                            {timestampToDateTime(visit.created_at)}
                            {"\n"}
                            <Text style={styles.labelBold}>{t("general.village")}:</Text>{" "}
                            {visit.village}
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
                    {t("visitAttr.visitLocation", { body: zone })}
                    {"\n"}
                    {visitSummary.health_visit && (
                        <SocialChip label={t("newVisit.health")} type={RiskType.HEALTH} />
                    )}{" "}
                    {visitSummary.educat_visit && (
                        <SocialChip label={t("newVisit.education")} type={RiskType.EDUCATION} />
                    )}{" "}
                    {visitSummary.social_visit && (
                        <SocialChip label={t("newVisit.social")} type={RiskType.SOCIAL} />
                    )}{" "}
                    {visitSummary.nutrit_visit && (
                        <SocialChip label={t("newVisit.nutrition")} type={RiskType.NUTRITION} />
                    )}{" "}
                    {visitSummary.mental_visit && (
                        <SocialChip label={t("newVisit.mental")} type={RiskType.MENTAL} />
                    )}{" "}
                </Dialog.Title>
                <Dialog.Content>
                    <Details />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose} color={themeColors.blueBgDark}>
                        {t("general.close")}
                    </Button>
                </Dialog.Actions>
            </>
        </ScrollView>
    );
};

export default VisitEntry;
