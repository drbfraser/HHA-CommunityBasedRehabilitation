import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Card, Divider, ActivityIndicator, TouchableRipple } from "react-native-paper";
import {
    clientInitialValues,
    Gender,
    IClient,
    TClientValues,
    themeColors,
    timestampToDate,
    IRisk,
    RiskType,
    apiFetch,
    Endpoint,
    ClientField,
    clientFieldLabels,
    mobileClientDetailsValidationSchema,
    timestampFromFormDate,
} from "@cbr/common";
import clientStyle from "./ClientDetails.styles";
import { Alert, Text, View, NativeModules } from "react-native";
import * as Localization from "expo-localization";
import { fetchClientDetailsFromApi } from "./ClientRequests";
import { IActivity, ActivityType } from "./ClientTimeline/Timeline";
import { ClientRisk } from "./Risks/ClientRisk";
import { ClientForm } from "../../components/ClientForm/ClientForm";
import { RecentActivity } from "./ClientTimeline/RecentActivity";
import { RouteProp, useNavigation, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackNavProp, StackParamList } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import { Formik, FormikHelpers } from "formik";
import { handleSubmit } from "../../components/ClientForm/ClientSubmitHandler";
import defaultProfilePicture from "../../util/defaultProfilePicture";
import FormikImageModal from "../../components/FormikImageModal/FormikImageModal";
import { useDatabase } from "@nozbe/watermelondb/hooks";

interface ClientProps {
    clientID: string;
    route: RouteProp<StackParamList, StackScreenName.CLIENT>;
    navigation: StackNavigationProp<StackParamList, StackScreenName.CLIENT>;
}

const ClientDetails = (props: ClientProps) => {
    const styles = clientStyle();
    const [loading, setLoading] = useState(true);
    const [touchDisable, setTouchDisable] = useState<boolean>(true);
    const isFocused = useIsFocused();
    const database = useDatabase();

    const [imageChange, setImageChange] = useState<boolean>(false);
    const [uri, setUri] = useState<string>("");
    const [originaluri, setOriginaluri] = useState<string>("");

    const [showImagePickerModal, setShowImagePickerModal] = useState<boolean>(false);
    const [client, setClient] = useState<any>();
    const [risks, setRisk] = useState<any>();
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

    const getClientDetails = async () => {
        try {
            const presentClient = await database.get("clients").find(props.route.params.clientID);
            console.log(presentClient);
            const fetchedRisk = await presentClient.risks.fetch();
            setClient(presentClient);
            setRisk(fetchedRisk);
        } catch (e) {
            console.log(e);
        }
    };

    const locale = NativeModules.I18nManager.localeIdentifier;
    const timezone = Localization.timezone;

    const getClientFormInitialValues = () => {
        if (client) {
            const clientFormProps: TClientValues = {
                ...clientInitialValues,
                firstName: client.first_name,
                lastName: client.last_name,
                birthDate: client.birth_date,
                gender: client.gender,
                village: client.village,
                zone: client.zone ?? "",
                phoneNumber: client.phone_number,
                caregiverPresent: client.caregiver_present,
                caregiverName: client.caregiver_name,
                caregiverEmail: client.caregiver_email,
                caregiverPhone: client.caregiver_phone,
                disability: client.disability,
                otherDisability: client.other_disability,
            };
            return clientFormProps;
        } else {
            return clientInitialValues;
        }
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
    /*
    if (client) {
        client.visits.forEach((presentVisit) => {
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
        client.referrals.forEach((presentRef) => {
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
        client.baseline_surveys.forEach((presentSurvey) => {
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
*/
    tempActivity.sort((a, b) => (a.date > b.date ? -1 : 1));

    const handleFormSubmit = (
        values: TClientValues,
        formikHelpers: FormikHelpers<TClientValues>
    ) => {
        handleSubmit(client, values, database, imageChange).finally(() =>
            formikHelpers.setSubmitting(false)
        );
    };

    return (
        <ScrollView style={styles.scrollViewStyles}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={themeColors.blueAccent} />
                </View>
            ) : (
                <View style={styles.clientDetailContainer}>
                    <Card style={styles.clientDetailsContainerStyles}>
                        <Formik
                            initialValues={getClientFormInitialValues()}
                            validationSchema={mobileClientDetailsValidationSchema}
                            onSubmit={handleFormSubmit}
                        >
                            {(formikProps) => (
                                <View style={styles.container}>
                                    <View style={styles.imageContainer}>
                                        <TouchableRipple
                                            disabled={touchDisable}
                                            onPress={() => setShowImagePickerModal(true)}
                                        >
                                            {imageChange ? (
                                                <Card.Cover
                                                    style={styles.clientCardImageStyle}
                                                    source={{ uri: uri }}
                                                />
                                            ) : originaluri !== "" ? (
                                                <Card.Cover
                                                    style={styles.clientCardImageStyle}
                                                    source={{ uri: originaluri }}
                                                />
                                            ) : (
                                                <Card.Cover
                                                    style={styles.clientCardImageStyle}
                                                    source={defaultProfilePicture}
                                                />
                                            )}
                                        </TouchableRipple>
                                    </View>
                                    <FormikImageModal
                                        field={ClientField.picture}
                                        fieldLabels={clientFieldLabels}
                                        formikProps={formikProps}
                                        visible={showImagePickerModal}
                                        onPictureChange={(url) => {
                                            setUri(url);
                                            setImageChange(true);
                                        }}
                                        onDismiss={() => setShowImagePickerModal(false)}
                                    />
                                    <Card style={styles.clientCardContainerStyles}>
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
                                    <ClientForm
                                        clientId={client?.id}
                                        formikProps={formikProps}
                                        isNewClient={false}
                                        touchDisable={(touched) => {
                                            setTouchDisable(touched);
                                        }}
                                        imageSave={() => {
                                            if (imageChange) {
                                                setOriginaluri(uri);
                                            }
                                        }}
                                        resetImage={() => {
                                            setImageChange(false);
                                        }}
                                    />
                                </View>
                            )}
                        </Formik>
                    </Card>
                    <Text style={styles.cardSectionTitle}>Client Risks</Text>
                    <Divider />
                    <ClientRisk clientRisks={risks || []} presentRiskType={RiskType.HEALTH} />
                    <Divider />
                    <ClientRisk clientRisks={risks || []} presentRiskType={RiskType.EDUCATION} />
                    <Divider />
                    <ClientRisk clientRisks={risks || []} presentRiskType={RiskType.SOCIAL} />
                    <Card style={styles.riskCardStyle}>
                        <View style={styles.activityCardContentStyle}>
                            <Text style={styles.riskTitleStyle}>Visits, Referrals & Surveys</Text>
                        </View>
                        {client && (
                            <RecentActivity
                                clientVisits={client.visits ?? []}
                                activity={tempActivity}
                                clientCreateDate={client.createdAt}
                                refreshClient={getClientDetails}
                            />
                        )}
                        <View style={styles.clientDetailsFinalView}></View>
                    </Card>
                </View>
            )}
        </ScrollView>
    );
};

export default ClientDetails;
