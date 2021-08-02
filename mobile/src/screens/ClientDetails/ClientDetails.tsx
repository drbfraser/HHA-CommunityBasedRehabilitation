import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Card, Divider, ActivityIndicator } from "react-native-paper";
import { Gender, IClient, IRisk, themeColors } from "@cbr/common";
import clientStyle from "./ClientDetails.styles";
import { Alert, Text, View } from "react-native";
import { fetchClientDetailsFromApi } from "./ClientRequests";
import { IReferral, ISurvey, timestampToDateObj } from "@cbr/common";
import { getOtherDisabilityId, useDisabilities } from "@cbr/common/src/util/hooks/disabilities";
import { IVisitSummary } from "@cbr/common";
import { IActivity, ActivityType } from "./ClientTimeline/Timeline";
import { ClientRisk } from "./Risks/ClientRisk";
import { ClientForm } from "../../components/ClientForm/ClientForm";
import { RecentActivity } from "./ClientTimeline/RecentActivity";
import { RouteProp, useNavigation, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackNavProp, StackParamList } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import {
    IClientFormProps,
    initialValues,
    validationSchema,
} from "../../components/ClientForm/ClientFormFields";
import { Formik } from "formik";
import { handleSubmit } from "../../components/ClientForm/ClientSubmitHandler";

interface ClientProps {
    clientID: number;
    route: RouteProp<StackParamList, StackScreenName.CLIENT>;
    navigation: StackNavigationProp<StackParamList, StackScreenName.CLIENT>;
}

const ClientDetails = (props: ClientProps) => {
    const styles = clientStyle();
    const [loading, setLoading] = useState(true);
    let disabilityMap = useDisabilities();
    const isFocused = useIsFocused();

    //Main Client Variables
    const [clientFormikProps, setClientFormikProps] = useState<IClientFormProps>();

    //Variables that cannot be edited and are for read only
    const [clientCreateDate, setClientCreateDate] = useState(0);
    const [clientVisits, setClientVisits] = useState<IVisitSummary[]>();
    const [clientReferrals, setClientReferrals] = useState<IReferral[]>();
    const [clientSurveys, setClientSurveys] = useState<ISurvey[]>();
    const [clientRisks, setClientRisks] = useState<IRisk[]>();

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

    const getInitialDisabilities = (disabilityArray: number[]) => {
        let selectedDisabilities: string[] = [];
        for (let disabilityId of disabilityArray) {
            if (disabilityMap.has(disabilityId)) {
                if (disabilityId === getOtherDisabilityId(disabilityMap)) {
                    selectedDisabilities.push("Other");
                } else {
                    selectedDisabilities.push(disabilityMap.get(disabilityId)!);
                }
            }
        }
        selectedDisabilities = selectedDisabilities.filter((v, i, a) => a.indexOf(v) === i);
        return selectedDisabilities;
    };

    const getClientDetails = async () => {
        const presentClient = await fetchClientDetailsFromApi(props.route.params.clientID);
        setClientCreateDate(presentClient.created_date);
        setClientVisits(presentClient.visits);
        setClientReferrals(presentClient.referrals);
        setClientSurveys(presentClient.baseline_surveys);

        const clientFormProps: IClientFormProps = {
            initialDisabilityArray: getInitialDisabilities(presentClient.disability),
            id: props.route.params.clientID,
            firstName: presentClient.first_name,
            lastName: presentClient.last_name,
            birthDate: timestampToDateObj(Number(presentClient?.birth_date)),
            gender: presentClient.gender,
            village: presentClient.village,
            zone: presentClient.zone,
            phone: presentClient.phone_number,
            caregiverPresent: presentClient.caregiver_present,
            caregiverName: presentClient.caregiver_name,
            caregiverEmail: presentClient.caregiver_email,
            caregiverPhone: presentClient.caregiver_phone,
            clientDisability: presentClient.disability,
            otherDisability: presentClient.other_disability,
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
        setClientRisks(presentClient.risks);
        setClientFormikProps(clientFormProps);
    };
    useEffect(() => {
        if (isFocused) {
            getClientDetails()
                .catch(() => errorAlert())
                .finally(() => setLoading(false));
        }
    }, [isFocused]);

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

    const handleFormSubmit = (values: IClientFormProps) => {
        const updatedIClient: IClient = {
            id: props.route.params.clientID,
            first_name: values.firstName ?? "",
            last_name: values.lastName ?? "",
            birth_date: values.birthDate ? values.birthDate.getTime() : new Date().getTime(),
            gender: values.gender as Gender,
            village: values.village ?? "",
            zone: values.zone ?? 0,
            phone_number: values.phone ?? "",
            caregiver_present: values.caregiverPresent ?? false,
            caregiver_name: values.caregiverName ?? "",
            caregiver_email: values.caregiverEmail ?? "",
            caregiver_phone: values.caregiverPhone ?? "",
            disability: values.clientDisability ?? [],
            other_disability: values.otherDisability ?? "",
            picture:
                "https://cbrs.cradleplatform.com/api/uploads/images/7cm5m2urohgbet8ew1kjggdw2fd9ts.png", //TODO: Don't use this picture
            created_by_user: values.createdByUser ?? 0,
            created_date: values.createdDate ?? new Date().getTime(),
            longitude: values.longitude ?? "",
            latitude: values.latitude ?? "",
            caregiver_picture: values.caregiverPicture,
            risks: values.risks ?? [],
            visits: values.visits ?? [],
            referrals: values.referrals ?? [],
            baseline_surveys: values.surveys ?? [],
        };
        handleSubmit(updatedIClient);
    };

    return (
        <ScrollView style={styles.scrollViewStyles}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={themeColors.blueAccent} />
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
                        <Button
                            mode="contained"
                            style={styles.clientButtons}
                            onPress={() => {
                                navigation.navigate(StackScreenName.VISIT, {
                                    clientID: props.route.params.clientID,
                                });
                            }}
                        >
                            New Visit
                        </Button>
                    </Card>
                    <Divider />
                    <Text style={styles.cardSectionTitle}>Client Details</Text>
                    <Divider />

                    <Card style={styles.clientDetailsContainerStyles}>
                        <Formik
                            initialValues={clientFormikProps ?? initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                handleFormSubmit(values);
                            }}
                        >
                            {(formikProps) => (
                                <ClientForm formikProps={formikProps} isNewClient={false} />
                            )}
                        </Formik>
                    </Card>
                    <Divider />
                    <ClientRisk clientRisks={clientRisks ? clientRisks : []} />
                    <Divider />
                    <Card style={styles.riskCardStyle}>
                        <View style={styles.activityCardContentStyle}>
                            <Text style={styles.riskTitleStyle}>Visits, Referrals & Surveys</Text>
                        </View>
                        <RecentActivity
                            clientVisits={clientVisits!}
                            activity={tempActivity}
                            clientCreateDate={clientCreateDate}
                        />
                        <View style={styles.clientDetailsFinalView}></View>
                    </Card>
                </View>
            )}
        </ScrollView>
    );
};

export default ClientDetails;
