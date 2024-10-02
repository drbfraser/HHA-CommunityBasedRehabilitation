import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
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
                    <Button
                        style={styles.logoButtonDark}
                        icon={"dots-vertical"}
                        color={"white"}
                        mode="outlined"
                        compact={true}
                    />
                    <View style={styles.verticleLine}></View>
                </View>
                <View style={styles.subItem}>
                    <Text style={styles.subItemTextDark}>{t("general.showMore")}</Text>
                    <Button
                        style={styles.arrowButton}
                        icon={"chevron-double-down"}
                        compact={true}
                    />
                </View>
            </View>
            <View style={styles.dividerStyle} />
        </View>
    );
};

export default ShowMore;
