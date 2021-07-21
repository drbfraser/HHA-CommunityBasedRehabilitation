import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Card, Divider, ActivityIndicator } from "react-native-paper";
import { IClient } from "@cbr/common";
import clientStyle from "./ClientDetails.styles";
import { Text, View } from "react-native";
import { fetchClientDetailsFromApi } from "./ClientRequests";
import { IReferral, ISurvey, timestampToDateObj } from "@cbr/common";
import {
    getDisabilities,
    getOtherDisabilityId,
    useDisabilities,
} from "@cbr/common/src/util/hooks/disabilities";
import { IVisitSummary } from "@cbr/common";
import { IActivity, ActivityType } from "./ClientTimeline/Activity";
import { useZones } from "@cbr/common/src/util/hooks/zones";
import { ClientRisk } from "./Risks/ClientRisk";
import { ClientForm } from "../../components/ClientForm/ClientForm";
import { RecentActivity } from "./ClientTimeline/RecentActivity";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { stackParamList, StackScreenName } from "../../util/stackScreens";

interface ClientProps {
    clientID: number;
    route: RouteProp<stackParamList, StackScreenName.CLIENT>;
    navigation: StackNavigationProp<stackParamList, StackScreenName.CLIENT>;
}

const ClientDetails = (props: ClientProps) => {
    React.useEffect(() => {
        props.navigation.setOptions({
            title: "Client Page",
            headerStyle: {
                backgroundColor: "#273263",
            },
            headerTintColor: "#fff",
            headerShown: true,
        });
    });

    const styles = clientStyle();
    const [loading, setLoading] = useState(true);
    var disabilityMap = useDisabilities();

    //Main Client Variables
    const [presentClient, setPresentClient] = useState<IClient>();
    const [initialDisabilityArray, setInitialDisabilityArray] = useState<string[]>();

    //Variables that cannot be edited and are for read only
    const [clientCreateDate, setClientCreateDate] = useState(0);
    const [clientVisits, setClientVisits] = useState<IVisitSummary[]>();
    const [clientReferrals, setClientReferrals] = useState<IReferral[]>();
    const [clientSurveys, setClientSurveys] = useState<ISurvey[]>();

    const getInitialDisabilities = (disabilityArray: number[], otherDisability?: string) => {
        var selectedDisabilities: string[] = [];

        for (let index of disabilityArray) {
            if (disabilityMap.has(index)) {
                if (index == getOtherDisabilityId(disabilityMap)) {
                    selectedDisabilities.push("Other - " + otherDisability);
                } else {
                    selectedDisabilities.push(disabilityMap.get(index)!);
                }
            }
        }
        selectedDisabilities = selectedDisabilities.filter((v, i, a) => a.indexOf(v) === i);
        return selectedDisabilities;
    };

    const getClientDetails = async () => {
        const presentClient = await fetchClientDetailsFromApi(props.route.params.clientID);
        setPresentClient(presentClient);
        setClientCreateDate(presentClient.created_date);
        setClientVisits(presentClient.visits);
        setClientReferrals(presentClient.referrals);
        setClientSurveys(presentClient.baseline_surveys);
        setInitialDisabilityArray(
            getInitialDisabilities(presentClient.disability, presentClient.other_disability)
        );
    };
    useEffect(() => {
        getClientDetails().then(() => {
            setLoading(false);
        });
    }, []);

    //Overall Screen editable toggle variables
    const [editMode, setEditMode] = useState(true);

    //Activity component rendering
    const tempActivity: IActivity[] = [];
    var presentId = 0;
    if (clientVisits) {
        clientVisits.forEach((presentVisit) => {
            tempActivity.push({
                id: presentId,
                type: ActivityType.VISIT,
                date: presentVisit.date_visited,
                visit: presentVisit,
                referral: undefined,
                survey: undefined,
            });
            presentId += 1;
        });
    }
    if (clientReferrals) {
        clientReferrals.forEach((presentRef) => {
            tempActivity.push({
                id: presentId,
                type: ActivityType.REFERAL,
                date: presentRef.date_referred,
                visit: undefined,
                referral: presentRef,
                survey: undefined,
            });
            presentId += 1;
        });
    }
    if (clientSurveys) {
        clientSurveys.forEach((presentSurvey) => {
            tempActivity.push({
                id: presentId,
                type: ActivityType.SURVEY,
                date: presentSurvey.survey_date,
                visit: undefined,
                referral: undefined,
                survey: presentSurvey,
            });
            presentId += 1;
        });
    }

    tempActivity.sort((a, b) => (a.date > b.date ? -1 : 1));

    return (
        <ScrollView style={styles.scrollViewStyles}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#273364" />
                </View>
            ) : (
                <View>
                    <Card style={styles.clientCardContainerStyles}>
                        <Card.Cover
                            style={styles.clientCardImageStyle}
                            source={{ uri: "https://picsum.photos/700" }}
                        />
                        <Button mode="contained" style={styles.clientButtons}>
                            New Visit
                        </Button>
                        <Button mode="contained" style={styles.clientButtons}>
                            New Referral
                        </Button>
                        <Button mode="contained" style={styles.clientButtons}>
                            Baseline Survey
                        </Button>
                    </Card>
                    <Divider />
                    <Text style={styles.cardSectionTitle}>Client Details</Text>
                    <Divider />
                    <Card style={styles.clientDetailsContainerStyles}>
                        <ClientForm
                            id={props.clientID}
                            firstName={presentClient!.first_name}
                            lastName={presentClient!.last_name}
                            date={timestampToDateObj(Number(presentClient?.birth_date))}
                            gender={presentClient!.gender}
                            village={presentClient!.village}
                            zone={presentClient!.zone}
                            phone={presentClient!.phone_number}
                            caregiverPresent={presentClient!.caregiver_present}
                            caregiverName={presentClient?.caregiver_name}
                            caregiverEmail={presentClient?.caregiver_email}
                            caregiverPhone={presentClient?.caregiver_phone}
                            clientDisability={presentClient!.disability}
                            otherDisability={presentClient?.other_disability}
                            initialDisabilityArray={initialDisabilityArray}
                        />
                    </Card>
                    <Divider />
                    <ClientRisk editMode={editMode}></ClientRisk>
                    <Divider />
                    <Card style={styles.riskCardStyle}>
                        <View style={styles.activityCardContentStyle}>
                            <Text style={styles.riskTitleStyle}>Visits, Referrals & Surveys</Text>
                        </View>
                        <RecentActivity
                            clientVisits={clientVisits!}
                            activityDTO={tempActivity}
                            clientCreateDate={clientCreateDate}
                        ></RecentActivity>
                        <View style={styles.clientDetailsFinalView}></View>
                    </Card>
                </View>
            )}
        </ScrollView>
    );
};

export default ClientDetails;
