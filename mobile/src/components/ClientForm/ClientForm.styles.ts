import { Dimensions, StyleSheet } from "react-native";
import { themeColors } from "@cbr/common";

const windowHeight = Dimensions.get("window").height;

const useStyles = () =>
    StyleSheet.create({
        clientBirthdayButtons: {
            marginTop: 3,
            borderRadius: 5,
        },
        clientBirthdayView: {
            display: "flex",
            alignItems: "baseline",
            flexDirection: "row",
            alignContent: "space-between",
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
        clientDetailsFinalView: {
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            marginTop: 15,
            marginBottom: 15,
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
        disabilityContainer: {
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
        },
        disabilityList: {
            flexGrow: 1,
            paddingRight: 20,
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
        field: {
            marginTop: 5,
        },
        modalSelectorButton: {
            padding: 3,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 5,
        },
        nestedScrollStyle: {
            marginBottom: 10,
        },
        nestedScrollView: {
            display: "flex",
            padding: 20,
            justifyContent: "center",
        },
        textGray: {
            color: themeColors.textGray,
        },
        valueText: {
            flex: 1,
            fontSize: 18,
            marginBottom: 15,
            marginStart: 15,
        },
    });

export default useStyles;
