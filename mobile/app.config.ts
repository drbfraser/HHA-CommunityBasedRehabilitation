import "dotenv/config";
import { ExpoConfig } from "@expo/config";

const BASE_APP_NAME = "CBR";

// Note: TypeScript for Expo configs are "experimental and subject to breaking changes."
// https://docs.expo.io/workflow/configuration/#using-typescript-for-configuration-appconfigts-instead-of
const commonAppConfig: ExpoConfig = {
    name: BASE_APP_NAME,
    slug: "cbr-mobile",
    version: "0.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: true,
    },
    android: {
        // TODO: Confirm with Izzy.
        package: "org.hopehealthaction.cbr",
        versionCode: 1,
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#FFFFFF",
        },
        allowBackup: false,
    },
    web: {
        favicon: "./assets/favicon.png",
    },
};

export default (): ExpoConfig => {
    const appEnv = process.env.APP_ENV;
    const prodApiUrl = "https://cbrp.cradleplatform.com/api/";
    const stagingApiUrl = "https://cbrs.cradleplatform.com/api/";

    if (appEnv === "prod") {
        return {
            ...commonAppConfig,
            name: BASE_APP_NAME,
            extra: {
                apiUrl: prodApiUrl,
            },
        };
    } else if (appEnv === "staging") {
        return {
            ...commonAppConfig,
            name: `${BASE_APP_NAME} (Staging)`,
            extra: {
                apiUrl: stagingApiUrl,
            },
        };
    } else {
        const devApiUrl = process.env.DEV_API_URL;
        return {
            ...commonAppConfig,
            name: `${BASE_APP_NAME} (Development)`,
            extra: {
                // Fall back to the staging server if not set.
                apiUrl: devApiUrl && devApiUrl.length !== 0 ? devApiUrl : stagingApiUrl,
            },
        };
    }
};
