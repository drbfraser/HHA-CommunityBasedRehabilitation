import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "react-native-paper";
import useStyles from "./Timeline.style";
import { useTranslation } from "react-i18next";

const ShowMore = () => {
    const styles = useStyles();
    const { t } = useTranslation();

    return (
        <View>
            <View style={styles.container}>
                <Text style={{ width: "25%" }}>{""}</Text>
                <View style={styles.activityTypeView}>
                    <View style={styles.verticleLine}></View>
                    <IconButton
                        style={styles.logoButtonDark}
                        icon={"dots-vertical"}
                        iconColor={"white"}
                        mode="outlined"
                        size={16}
                    />
                    <View style={styles.verticleLine}></View>
                </View>
                <View style={styles.subItem}>
                    <Text style={styles.subItemTextDark}>{t("general.showMore")}</Text>
                    <IconButton style={styles.arrowButton} icon={"chevron-double-down"} size={16} />
                </View>
            </View>
            <View style={styles.dividerStyle} />
        </View>
    );
};

export default ShowMore;
