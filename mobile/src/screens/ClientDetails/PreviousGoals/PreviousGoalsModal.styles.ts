import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    dialog: {
        backgroundColor: themeColors.white,
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
    cell: {
        paddingRight: 12,
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
