import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Card, Divider, ActivityIndicator } from "react-native-paper";
import { IClient } from "@cbr/common";
import clientStyle from "./ClientDetails.styles";
import { Alert, Text, View } from "react-native";
import { fetchClientDetailsFromApi } from "./ClientRequests";
import { IReferral, ISurvey, timestampToDateObj } from "@cbr/common";
import { getOtherDisabilityId, useDisabilities } from "@cbr/common/src/util/hooks/disabilities";
import { IVisitSummary } from "@cbr/common";
import { IActivity, ActivityType } from "./ClientTimeline/Activity";
import { useZones } from "@cbr/common/src/util/hooks/zones";
import { ClientRisk } from "./Risks/ClientRisk";
import { ClientForm } from "../../components/ClientForm/ClientForm";
import { RecentActivity } from "./ClientTimeline/RecentActivity";
import { RouteProp, useNavigation, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackNavProp, StackParamList } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import { IClientFormProps, InitialValues } from "../../components/ClientForm/ClientFormFields";

interface ClientProps {
    clientID: number;
    route: RouteProp<StackParamList, StackScreenName.CLIENT>;
    navigation: StackNavigationProp<StackParamList, StackScreenName.CLIENT>;
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
    let disabilityMap = useDisabilities();
    const isFocused = useIsFocused();

    //Main Client Variables
    const [presentClient, setPresentClient] = useState<IClient>();
    const [clientFormikProps, setClientFormikProps] = useState<IClientFormProps>(InitialValues);

    //Variables that cannot be edited and are for read only
    const [clientCreateDate, setClientCreateDate] = useState(0);
    const [clientVisits, setClientVisits] = useState<IVisitSummary[]>();
    const [clientReferrals, setClientReferrals] = useState<IReferral[]>();
    const [clientSurveys, setClientSurveys] = useState<ISurvey[]>();

    const errorAlert = () =>
        Alert.alert("Alert", "We were unable to fetch the client, please try again.", [
            {
                text: "Return",
                style: "cancel",
                onPress: () => {
                    props.navigation.goBack();
                },
            },
        ]);

    const getInitialDisabilities = (disabilityArray: number[], otherDisability?: string) => {
        let selectedDisabilities: string[] = [];

        for (let index of disabilityArray) {
            if (disabilityMap.has(index)) {
                if (index === getOtherDisabilityId(disabilityMap)) {
                    selectedDisabilities.push("Other");
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

        const clientFormProps: IClientFormProps = {
            id: props.route.params.clientID,
            firstName: presentClient!.first_name,
            lastName: presentClient!.last_name,
            date: timestampToDateObj(Number(presentClient?.birth_date)),
            gender: presentClient!.gender,
            village: presentClient!.village,
            zone: presentClient!.zone,
            phone: presentClient!.phone_number,
            caregiverPresent: presentClient!.caregiver_present,
            caregiverName: presentClient?.caregiver_name,
            caregiverEmail: presentClient?.caregiver_email,
            caregiverPhone: presentClient?.caregiver_phone,
            clientDisability: presentClient!.disability,
            otherDisability: presentClient?.other_disability,
            initialDisabilityArray: getInitialDisabilities(
                presentClient.disability,
                presentClient.other_disability
            ),
            createdDate: presentClient.created_date,
            createdByUser: presentClient.created_by_user,
            longitude: presentClient.longitude,
            latitude: presentClient.latitude,
            caregiverPicture: String(presentClient.caregiver_picture),
            risks: presentClient.risks,
            visits: presentClient.visits,
            referrals: presentClient.referrals,
            surveys: presentClient.baseline_surveys,
        };
        setClientFormikProps(clientFormProps);
    };
    useEffect(() => {
        if (isFocused) {
            getClientDetails()
                .then(() => {
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    errorAlert();
                });
        }
    }, [isFocused]);

    //Overall Screen editable toggle variables
    const [editMode, setEditMode] = useState(true);

    //Activity component rendering
    const navigation = useNavigation<AppStackNavProp>();
    const tempActivity: IActivity[] = [];
    let presentId = 0;
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
                            source={{
                                uri: "https://cbrs.cradleplatform.com/api/uploads/images/7cm5m2urohgbet8ew1kjggdw2fd9ts.png",
                            }}
                        />
                        <Button
                            mode="contained"
                            style={styles.clientButtons}
                            onPress={() => {
                                navigation.navigate(StackScreenName.REFERRAL, {
                                    clientID: props.route.params.clientID,
                                });
                            }}
                        >
                            New Referral
                        </Button>
                        <Button
                            mode="contained"
                            style={styles.clientButtons}
                            onPress={() => {
                                navigation.navigate(StackScreenName.BASE_SURVEY, {
                                    clientID: props.route.params.clientID,
                                });
                            }}
                        >
                            Baseline Survey
                        </Button>
                        <Button mode="contained" style={styles.clientButtons}>
                            Baseline Survey
                        </Button>
                    </Card>
                    <Divider />
                    <Text style={styles.cardSectionTitle}>Client Details</Text>
                    <Divider />
                    <Card style={styles.clientDetailsContainerStyles}>
                        <ClientForm clientFormProps={clientFormikProps!} />
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
