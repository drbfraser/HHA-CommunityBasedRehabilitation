import { themeColors } from "@cbr/common";
import { Dimensions, StyleSheet } from "react-native";

const windowHeight = Dimensions.get("window").height;

const useStyles = () =>
    StyleSheet.create({
        container: {
            margin: 20,
        },
        imageContainer: {
            flexDirection: "row",
        },
        image: {
            backgroundColor: themeColors.white,
            borderRadius: 30,
            resizeMode: "contain",
            width: "100%",
            height: "auto",
            aspectRatio: 1,
        },
        clientDetailContainer: {
            flex: 1,
        },
        clientButtons: {
            padding: 3,
            marginTop: 3,
            marginBottom: 15,
            width: 256,
            borderRadius: 5,
        },
        clientCardContainerStyles: {
            marginTop: 10,
            alignItems: "center",
            borderRadius: 20,
        },
        clientCardImageStyle: {
            backgroundColor: themeColors.white,
            width: 256,
            height: 256,
            marginTop: 10,
            marginBottom: 10,
            shadowColor: "#FFFFFF",
            borderRadius: 30,
            overflow: "hidden",
        },
        clientDetailsContainerStyles: {
            marginTop: 20,
            marginBottom: 20,
            paddingBottom: 15,
            paddingTop: 15,
            alignItems: "center",
            borderRadius: 20,
            flexShrink: 1,
        },
        clientTextStyle: {
            marginTop: 10,
            marginBottom: 10,
            height: 60,
            width: 350,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
        },
        clientDetailsButtons: {
            alignItems: "center",
            padding: 3,
            marginTop: 5,
            marginBottom: 15,
            width: 350,
            borderRadius: 5,
        },
        carePresentView: {
            alignItems: "baseline",
            display: "flex",
            flexDirection: "row",
        },
        valueText: {
            flex: 1,
            fontSize: 18,
            marginBottom: 15,
            marginStart: 15,
        },
        carePresentCheckBox: {
            alignContent: "flex-start",
            fontSize: 18,
        },
        scrollViewStyles: {
            marginHorizontal: 5,
        },
        clientDetailsFinalButtons: {
            padding: 3,
            marginTop: 3,
            marginBottom: 15,
            marginLeft: 10,
            marginRight: 10,
            width: 112,
            borderRadius: 5,
        },
        clientBirthdayView: {
            display: "flex",
            alignItems: "baseline",
            flexDirection: "row",
            alignContent: "space-between",
        },
        clientBirthdayButtons: {
            marginTop: 3,
            borderRadius: 5,
        },
        field: {
            marginTop: 5,
        },
        pickerStyle: {
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "blue",
            borderRadius: 5,
            alignItems: "center",
            paddingHorizontal: 8,
            paddingVertical: 8,
            marginHorizontal: 8,
            marginVertical: 8,
            height: 40,
            width: 200,
        },
        clientDetailsFinalView: {
            alignItems: "center",
            justifyContent: "flex-end",
            display: "flex",
            flexDirection: "row",
            height: 40,
            marginTop: 15,
            marginBottom: 15,
        },
        riskCardStyle: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 20,
            paddingBottom: 15,
            paddingTop: 15,
            alignItems: "center",
            borderRadius: 20,
        },
        riskCardContentStyle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: 70,
            width: 350,
            marginTop: 15,
        },
        riskIconStyle: {
            marginTop: 10,
            display: "flex",
            justifyContent: "flex-start",
        },
        riskTitleStyle: {
            marginTop: 10,
            fontSize: 32,
            justifyContent: "center",
            fontWeight: "bold",
        },
        riskSubtitleStyle: {
            marginTop: 14,
            fontSize: 22,
            alignItems: "center",
            justifyContent: "flex-end",
            display: "flex",
            flexDirection: "row",
        },
        riskHeaderStyle: {
            marginTop: 14,
            marginBottom: 2,
            fontSize: 18,
            justifyContent: "flex-start",
            fontWeight: "bold",
        },
        riskRequirementStyle: {
            fontSize: 16,
            justifyContent: "flex-start",
        },
        cardSectionTitle: {
            textAlign: "center",
            marginTop: 14,
            marginBottom: 14,
            fontSize: 32,
        },
        activityCardContentStyle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: 110,
            width: 350,
            marginTop: 15,
        },
        itemDividerStyle: {
            borderBottomColor: "black",
            borderBottomWidth: 1,
        },
        loadingContainer: {
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            marginTop: 300,
        },
        disabilityCheckContainer: {
            display: "flex",
            flex: 0,
        },
        disabilityListHeaderContainerStyle: {
            marginTop: 4,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
        },
        disabilityListHeaderStyle: {
            fontSize: 24,
        },
        disabilityList: {
            flexGrow: 1,
            paddingRight: 20,
        },
        disabilityChecklist: {
            marginHorizontal: 20,
            alignSelf: "center",
            paddingTop: 20,
            paddingBottom: 50,
            backgroundColor: "white",
            borderRadius: 10,
            maxHeight: windowHeight / 1.25,
            marginTop: windowHeight / 8,
        },
        zoneChecklist: {
            height: 540,
            marginHorizontal: 20,
            marginTop: 140,
            display: "flex",
            backgroundColor: "white",
            borderRadius: 10,
            justifyContent: "space-between",
        },
        genderChecklist: {
            height: 280,
            marginHorizontal: 20,
            marginTop: 250,
            display: "flex",
            backgroundColor: "white",
            borderRadius: 10,
            justifyContent: "space-between",
        },
        nestedGenderScrollView: {
            display: "flex",
            justifyContent: "center",
            padding: 20,
        },
        nestedScrollView: {
            display: "flex",
            padding: 20,
            justifyContent: "center",
        },
        nestedScrollStyle: {
            marginBottom: 10,
        },
        otherDisabilityStyle: {
            marginLeft: 5,
            marginEnd: 10,
            height: 60,
            width: 300,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
        },
        modalSelectorButton: {
            padding: 3,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 5,
        },
        errorText: {
            color: themeColors.errorRed,
            alignSelf: "center",
        },
        disabilityContainer: {
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
        },
    });

export default useStyles;
