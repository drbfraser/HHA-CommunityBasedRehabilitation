import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: themeColors.white,
        },
        scrollView: {
            flex: 1,
        },
        contentContainer: {
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 48,
        },
        form: {
            gap: 16,
            alignSelf: "center",
            width: "100%",
            maxWidth: 900,
        },
        card: {
            borderRadius: 18,
            borderWidth: 1,
            borderColor: themeColors.blueBgLight,
            backgroundColor: themeColors.white,
            shadowColor: "#273364",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 18,
            elevation: 3,
        },
        cardContent: {
            gap: 8,
        },
        subheading: {
            marginBottom: 8,
            fontWeight: "700",
            fontSize: 20,
        },
        reportTypeToggle: {
            marginTop: 2,
        },
        divider: {
            marginVertical: 18,
            backgroundColor: themeColors.blueBgLight,
        },
        descriptionField: {
            marginTop: 8,
            textAlignVertical: "top",
            minHeight: 140,
            backgroundColor: themeColors.white,
        },
        descriptionFieldContent: {
            paddingTop: 10,
        },
        helperText: {
            marginTop: 10,
            color: themeColors.textGray,
        },
        attachControls: {
            marginTop: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
        },
        imageMeta: {
            marginTop: 10,
            alignItems: "flex-start",
        },
        imagePreview: {
            marginTop: 12,
            width: "100%",
            height: 160,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: themeColors.blueBgLight,
            backgroundColor: themeColors.white,
        },
        outlinedActionButton: {
            borderWidth: 2,
        },
        chooseImageButton: {
            borderColor: themeColors.blueBgDark,
        },
        cardActions: {
            justifyContent: "space-between",
            marginTop: 10,
            paddingHorizontal: 16,
            paddingBottom: 16,
        },
        successAlert: {
            borderRadius: 4,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: "#B7E4C7",
            backgroundColor: "#EAF8EE",
        },
        successAlertText: {
            color: "#1E6D3A",
        },
    });

export default useStyles;
