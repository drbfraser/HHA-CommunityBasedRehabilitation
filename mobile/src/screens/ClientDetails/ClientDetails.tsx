import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Card, Divider, ActivityIndicator } from "react-native-paper";
import { ClientDTO } from "./ClientRequests";
import clientStyle from "./ClientDetails.styles";
import { Text, View } from "react-native";
import { fetchClientDetailsFromApi } from "./ClientRequests";
import { IReferral, ISurvey, timestampToDateObj } from "@cbr/common";
import { useDisabilities } from "@cbr/common/src/util/hooks/disabilities";
import { IVisitSummary } from "@cbr/common";
import { ActivityDTO, ActivityType } from "./ClientTimeline/Activity";
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

    //Main Client Variables
    const [presentClient, setPresentClient] = useState<ClientDTO>();
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

    //Variables that cannot be edited and are for read only
    const [clientCreateDate, setClientCreateDate] = useState(0);
    const [clientVisits, setClientVisits] = useState<IVisitSummary[]>();
    const [clientReferrals, setClientReferrals] = useState<IReferral[]>();
    const [clientSurveys, setClientSurveys] = useState<ISurvey[]>();
    const [allRecentActivity, setRecentActivity] = useState<ActivityDTO[]>();

    const getClientDetails = async () => {
        const presentClient = await fetchClientDetailsFromApi(props.route.params.clientID);
        setPresentClient(presentClient);
        setDate(timestampToDateObj(Number(presentClient?.birthdate)));
        setFirstName(presentClient.first_name);
        setLastName(presentClient.last_name);
        setVillage(presentClient.village);
        setZone(presentClient.zone);
        setPhoneNumber(presentClient.phoneNumber);
        setOtherDisability(presentClient.otherDisability);
        setCaregiverPresent(presentClient.careGiverPresent);
        setGender(presentClient.gender);
        if (caregiverPresent) {
            setCaregiverName(presentClient.careGiverName);
            setCaregiverPhone(presentClient.careGiverPhoneNumber);
            setCaregiverEmail(presentClient.careGiverEmail);
        }
        setDisability(presentClient.disabilities);
        setClientCreateDate(presentClient.clientCreatedDate);
        setClientVisits(presentClient.clientVisits);
        setClientReferrals(presentClient.clientReferrals);
        setClientSurveys(presentClient.clientSurveys);
    };
    useEffect(() => {
        getClientDetails().then(() => {
            setLoading(false);
        });
    }, []);

    //Overall Screen editable toggle variables
    const [editMode, setEditMode] = useState(true);
    const [cancelButtonType, setCancelButtonType] = useState("outlined");
    const enableButtons = () => {
        if (editMode == true) {
            setEditMode(false);
            setCancelButtonType("contained");
        } else {
            //Make the PUT Api Call to edit client here since this is the save click
            setEditMode(true);
            setCancelButtonType("outlined");
        }
    };

    //Activity component rendering
    const tempActivity: ActivityDTO[] = [];
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
                        />
                    </Card>
                    <Divider></Divider>
                    <ClientRisk editMode={editMode}></ClientRisk>
                    <Divider></Divider>
                    <Card style={styles.riskCardStyle}>
                        <View style={styles.activityCardContentStyle}>
                            <Text style={styles.riskTitleStyle}>Visits, Referrals & Surveys</Text>
                        </View>
                        {/* <View>{recentActivity()}</View> */}
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
