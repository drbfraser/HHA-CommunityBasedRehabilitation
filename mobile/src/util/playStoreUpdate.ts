import type { TFunction } from "i18next";
import { Alert, Platform } from "react-native";
import SpInAppUpdates from "sp-react-native-in-app-updates";

const inAppUpdates = new SpInAppUpdates(__DEV__ /* isDebug */);

// Only remind once per app session so we don't nag the user repeatedly.
let hasCheckedThisSession = false;

export async function checkForPlayStoreUpdate(t: TFunction): Promise<void> {
    // In-App Updates is an Android/Play Store feature; skip elsewhere.
    if (Platform.OS !== "android" || hasCheckedThisSession) {
        return;
    }
    hasCheckedThisSession = true;

    try {
        const result = await inAppUpdates.checkNeedsUpdate();
        if (!result.shouldUpdate) {
            return;
        }

        Alert.alert(
            t("alert.updateAvailableTitle"),
            t("alert.updateAvailableMessage"),
            [{ text: t("general.ok"), style: "cancel" }],
            { cancelable: true }
        );
    } catch (e) {
        console.log("[UpdateCheck] Play Store update check skipped:", e);
    }
}
