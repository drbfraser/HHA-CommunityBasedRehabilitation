import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    dialog: {
        backgroundColor: "#eeeeee",
        marginHorizontal: 12,
    },
    tableContainer: {
        marginTop: 8,
    },
    table: {
        minWidth: 760,
    },
    headerCell: {
        paddingRight: 12,
    },
    headerText: {
        color: "#1f1f1f",
        fontWeight: "700",
        fontSize: 15,
    },
    cell: {
        paddingRight: 12,
    },
    cellText: {
        color: "#202020",
        fontWeight: "600",
        fontSize: 15,
    },
    riskLevelColumn: {
        minWidth: 100,
        flex: 0,
    },
    areaColumn: {
        minWidth: 100,
        flex: 0,
    },
    goalColumn: {
        minWidth: 240,
        flex: 0,
    },
    dateColumn: {
        minWidth: 110,
        flex: 0,
    },
    statusColumn: {
        minWidth: 140,
        flex: 0,
    },
    pagination: {
        alignSelf: "flex-end",
        marginTop: 4,
    },
    paginationLabelText: {
        color: "#1f1f1f",
        fontWeight: "700",
        fontSize: 14,
    },
    riskPill: {
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignSelf: "flex-start",
        minWidth: 70,
        alignItems: "center",
    },
    riskPillText: {
        color: themeColors.white,
        fontWeight: "bold",
        fontSize: 14,
    },
    statusBadge: {
        borderRadius: 2,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: "flex-start",
    },
    statusBadgeText: {
        color: themeColors.white,
        fontWeight: "bold",
        fontSize: 14,
    },
    emptyText: {
        marginVertical: 12,
        fontSize: 16,
    },
    detailScroll: {
        maxHeight: 420,
    },
    detailMetaSection: {
        marginBottom: 12,
    },
    detailMetaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        flexWrap: "wrap",
    },
    detailMetaLabel: {
        fontWeight: "bold",
        marginRight: 6,
    },
    detailInput: {
        marginTop: 12,
        backgroundColor: themeColors.white,
    },
});

export default styles;
