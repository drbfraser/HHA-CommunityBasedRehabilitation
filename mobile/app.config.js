import "dotenv/config";

const commonAppConfig = {
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

module.exports = () => {
    // TODO: When we add a script to build a production version of the app, ensure that the
    //  command is prefixed like `APP_ENV=prod expo build:android`. We're not doing this yet
    //  until we settle on what to do for app distribution.
    const appEnv = process.env.APP_ENV;
    const prodApiUrl = "https://cbrp.cradleplatform.com/api/";
    const stagingApiUrl = "https://cbrs.cradleplatform.com/api/";

    if (appEnv === "prod") {
        return {
            ...commonAppConfig,
            name: "CBR",
            extra: {
                apiUrl: prodApiUrl,
            },
        };
    } else if (appEnv === "staging") {
        return {
            ...commonAppConfig,
            name: "CBR (Staging)",
            extra: {
                apiUrl: stagingApiUrl,
            },
        };
    } else {
        const devApiUrl = process.env.DEV_API_URL;
        return {
            ...commonAppConfig,
            name: "CBR (Development)",
            extra: {
                // Fall back to the staging server if not set.
                apiUrl: typeof devApiUrl === "string" ? devApiUrl : stagingApiUrl,
            },
        };
    }
};
