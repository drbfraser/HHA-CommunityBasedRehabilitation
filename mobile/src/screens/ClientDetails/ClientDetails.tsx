import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Card, Divider, ActivityIndicator } from "react-native-paper";
import clientStyle from "./ClientDetails.styles";
import { Text, View } from "react-native";
import { fetchClientDetailsFromApi } from "./ClientRequests";
import { IClient, IReferral, ISurvey, themeColors, timestampToDateObj } from "@cbr/common";
import { getDisabilities, useDisabilities } from "@cbr/common/src/util/hooks/disabilities";
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

interface IClientProps {
    clientID: number;
    route: RouteProp<StackParamList, StackScreenName.CLIENT>;
    navigation: StackNavigationProp<StackParamList, StackScreenName.CLIENT>;
}

const ClientDetails = (props: IClientProps) => {
    React.useEffect(() => {
        props.navigation.setOptions({
            title: "Client Page",
            headerStyle: {
                backgroundColor: themeColors.blueBgDark,
            },
            headerTintColor: themeColors.white,
            headerShown: true,
        });
    });

    const styles = clientStyle();
    const [loading, setLoading] = useState(true);
    var disabilityList = useDisabilities();
    const isFocused = useIsFocused();
    //Main Client Variables
    const [presentClient, setPresentClient] = useState<IClient>();
    const [date, setDate] = useState(new Date());
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [village, setVillage] = useState("");
    const [gender, setGender] = useState("");
    const [zone, setZone] = useState<number>();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [caregiverPresent, setCaregiverPresent] = useState(false);
    const [caregiverName, setCaregiverName] = useState("");
    const [caregiverEmail, setCaregiverEmail] = useState("");
    const [caregiverPhone, setCaregiverPhone] = useState("");
    const [clientDisability, setDisability] = useState<number[]>([]);
    const [otherDisability, setOtherDisability] = useState<String>();
    const [initialDisabilityArray, setInitialDisabilityArray] = useState<string[]>();

    //Variables that cannot be edited and are for read only
    const [clientCreateDate, setClientCreateDate] = useState(0);
    const [clientVisits, setClientVisits] = useState<IVisitSummary[]>();
    const [clientReferrals, setClientReferrals] = useState<IReferral[]>();
    const [clientSurveys, setClientSurveys] = useState<ISurvey[]>();

    const getInitialDisabilities = (disabilityArray: number[]) => {
        var selectedDisabilities: string[] = [];

        for (let index of disabilityArray) {
            if (disabilityList.has(index)) {
                selectedDisabilities.push(disabilityList.get(index)!);
            }
        }
        selectedDisabilities = selectedDisabilities.filter((v, i, a) => a.indexOf(v) === i);
        return selectedDisabilities;
    };

    const getClientDetails = async () => {
        const presentClient = await fetchClientDetailsFromApi(props.route.params.clientID);
        setPresentClient(presentClient);
        setDate(timestampToDateObj(Number(presentClient?.birth_date)));
        setFirstName(presentClient.first_name);
        setLastName(presentClient.last_name);
        setVillage(presentClient.village);
        setZone(presentClient.zone);
        setPhoneNumber(presentClient.phone_number);
        setOtherDisability(presentClient.other_disability);
        setCaregiverPresent(presentClient.caregiver_present);
        setGender(presentClient.gender);
        if (caregiverPresent) {
            setCaregiverName(presentClient.caregiver_name);
            setCaregiverPhone(presentClient.caregiver_phone);
            setCaregiverEmail(presentClient.caregiver_email);
        }
        setDisability(presentClient.disability);
        setClientCreateDate(presentClient.created_date);
        setClientVisits(presentClient.visits);
        setClientReferrals(presentClient.referrals);
        setClientSurveys(presentClient.baseline_surveys);
        setInitialDisabilityArray(getInitialDisabilities(presentClient.disability));
    };
    useEffect(() => {
        getClientDetails().then(() => {
            setLoading(false);
        });
    }, [isFocused]);

    //Overall Screen editable toggle variables
    const [editMode, setEditMode] = useState(true);

    //Activity component rendering
    const navigation = useNavigation<AppStackNavProp>();
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
                    </Card>
                    <Divider></Divider>
                    <Text style={styles.cardSectionTitle}>Client Details</Text>
                    <Divider></Divider>
                    <Card style={styles.clientDetailsContainerStyles}>
                        <ClientForm
                            //isNewClient={true}
                            id={props.clientID}
                            firstName={firstName}
                            lastName={lastName}
                            date={date}
                            gender={gender}
                            village={village}
                            zone={zone}
                            phone={phoneNumber}
                            caregiverPresent={caregiverPresent}
                            caregiverName={caregiverName}
                            caregiverEmail={caregiverEmail}
                            caregiverPhone={caregiverPhone}
                            clientDisability={clientDisability}
                            otherDisability={otherDisability}
                            initialDisabilityArray={initialDisabilityArray}
                        />
                    </Card>
                    <Divider></Divider>
                    <ClientRisk editMode={editMode}></ClientRisk>
                    <Divider></Divider>
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
