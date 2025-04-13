import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Card, Divider, ActivityIndicator, TouchableRipple } from "react-native-paper";
import {
    clientInitialValues,
    TClientValues,
    themeColors,
    RiskType,
    ClientField,
    clientFieldLabels,
    mobileClientDetailsValidationSchema,
    ISurvey,
    IRisk,
} from "@cbr/common";
import clientStyle from "./ClientDetails.styles";
import { Alert, Text, View, NativeModules } from "react-native";
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
import { modelName } from "../../models/constant";
import ConflictDialog from "../../components/ConflictDialog/ConflictDialog";
import { SyncContext } from "../../context/SyncContext/SyncContext";
import { useTranslation } from "react-i18next";

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
    const { autoSync, cellularSync } = useContext(SyncContext);

    const [imageChange, setImageChange] = useState<boolean>(false);
    const [uri, setUri] = useState<string>("");
    const [originaluri, setOriginaluri] = useState<string>("");

    const [showImagePickerModal, setShowImagePickerModal] = useState<boolean>(false);
    const [client, setClient] = useState<any>();
    const [risks, setRisk] = useState<IRisk[]>();
    const [referrals, setReferrals] = useState<any>();
    const [surveys, setSurveys] = useState<ISurvey[]>();
    const [visits, setVisits] = useState<any>();
    const { t } = useTranslation();
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
            const presentClient: any = await database
                .get(modelName.clients)
                .find(props.route.params.clientID);
            const fetchedRisk = await presentClient.risks.fetch();
            const fetchedReferrals = await presentClient.referrals.fetch();
            const fetchedSurveys = await presentClient.surveys.fetch();
            const fetchedVisits = await presentClient.visits.fetch();
            setClient(presentClient);
            setRisk(fetchedRisk);
            setReferrals(fetchedReferrals);
            setSurveys(fetchedSurveys);
            setVisits(fetchedVisits);
            if (presentClient.picture != null) {
                setOriginaluri(presentClient.picture);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const getClientFormInitialValues = () => {
        if (client) {
            const clientFormProps: TClientValues = {
                ...clientInitialValues,
                firstName: client.first_name,
                lastName: client.last_name,
                birthDate: client.birth_date,
                gender: client.gender,
                village: client.village,
                picture: client.picture,
                zone: client.zone ?? "",
                phoneNumber: client.phone_number,
                caregiverPresent: client.caregiver_present,
                caregiverName: client.caregiver_name,
                caregiverEmail: client.caregiver_email,
                caregiverPhone: client.caregiver_phone,
                disability: client.disability,
                otherDisability: client.other_disability,
                is_active: client.is_active,
                hcrType: client.hcr_type,
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

    if (referrals) {
        referrals.forEach((presentReferral) => {
            tempActivity.push({
                id: presentId,
                type: ActivityType.REFERAL,
                date: presentReferral.date_referred,
                visit: undefined,
                referral: presentReferral,
                survey: undefined,
            });
            presentId += 1;
        });
    }

    if (surveys) {
        surveys.forEach((presentSurvey) => {
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

    if (visits) {
        visits.forEach((presentVisit) => {
            tempActivity.push({
                id: presentId,
                type: ActivityType.VISIT,
                date: presentVisit.createdAt,
                visit: presentVisit,
                referral: undefined,
                survey: undefined,
            });
            presentId += 1;
        });
    }

    tempActivity.sort((a, b) => (a.date > b.date ? -1 : 1));

    const handleFormSubmit = (
        values: TClientValues,
        formikHelpers: FormikHelpers<TClientValues>
    ) => {
        handleSubmit(client, values, database, autoSync, cellularSync, imageChange).finally(() =>
            formikHelpers.setSubmitting(false)
        );
    };

    return (
        <ScrollView style={styles.scrollViewStyles}>
            <ConflictDialog />
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={themeColors.blueAccent} />
                </View>
            ) : (
                <View style={styles.clientDetailContainer}>
                    <Card style={styles.clientDetailsContainerStyles}>
                        <Formik
                            initialValues={getClientFormInitialValues()}
                            enableReinitialize
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
                                            disabled={!formikProps.values.is_active}
                                            onPress={() => {
                                                navigation.navigate(StackScreenName.REFERRAL, {
                                                    clientID: props.route.params.clientID,
                                                });
                                            }}
                                        >
                                            {t("referralAttr.newReferral")}
                                        </Button>
                                        <Button
                                            mode="contained"
                                            style={styles.clientButtons}
                                            disabled={!formikProps.values.is_active}
                                            onPress={() => {
                                                navigation.navigate(StackScreenName.BASE_SURVEY, {
                                                    clientID: props.route.params.clientID,
                                                });
                                            }}
                                        >
                                            {t("surveyAttr.baselineSurvey")}
                                        </Button>
                                        <Button
                                            mode="contained"
                                            style={styles.clientButtons}
                                            disabled={!formikProps.values.is_active}
                                            onPress={() => {
                                                navigation.navigate(StackScreenName.VISIT, {
                                                    clientID: props.route.params.clientID,
                                                });
                                            }}
                                        >
                                            {t("visitAttr.newVisit")}
                                        </Button>
                                    </Card>
                                    <Divider />
                                    {formikProps.values.is_active ? (
                                        <></>
                                    ) : (
                                        <Text style={styles.archiveWarningStyle}>
                                            {t("clientAttr.archivedClientAccessAlert")}
                                        </Text>
                                    )}
                                    <Text style={styles.cardSectionTitle}>
                                        {t("clientAttr.clientDetails")}
                                    </Text>
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
                    <Text style={styles.cardSectionTitle}>{t("clientAttr.clientRisks")}</Text>
                    <Divider />
                    <ClientRisk
                        clientRisks={risks || []}
                        presentRiskType={RiskType.HEALTH}
                        clientArchived={client.is_active}
                    />
                    <Divider />
                    <ClientRisk
                        clientRisks={risks || []}
                        presentRiskType={RiskType.EDUCATION}
                        clientArchived={client.is_active}
                    />
                    <Divider />
                    <ClientRisk
                        clientRisks={risks || []}
                        presentRiskType={RiskType.SOCIAL}
                        clientArchived={client.is_active}
                    />
                    <Divider />
                    <ClientRisk
                        clientRisks={risks || []}
                        presentRiskType={RiskType.NUTRITION}
                        clientArchived={client.is_active}
                    />
                    <Divider />
                    <ClientRisk
                        clientRisks={risks || []}
                        presentRiskType={RiskType.MENTAL}
                        clientArchived={client.is_active}
                    />
                    <Card style={styles.riskCardStyle}>
                        <View style={styles.activityCardContentStyle}>
                            <Text style={styles.riskTitleStyle}>
                                {t("clientAttr.visitsRefsSurveys")}
                            </Text>
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
