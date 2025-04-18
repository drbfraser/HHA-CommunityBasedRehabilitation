/*
    Expo plugin to update `android.signingConfigs.release` in `android/app/build.gradle` as needed for release.
    Based on: https://www.reddit.com/r/expo/comments/1j4v323/config_plugin_to_fix_signingconfigs_for_android/
    Referencing: https://docs.expo.dev/config-plugins/plugins-and-mods/

    This configuration was written for React Native 0.74, and is currently denoted as *Dangerous* by Expo due
    to using `mods.android.appBuildGradle` to modify `android/app/build.gradle` as a string as Expo does not allow
    the modification of this file as JSON at this time.  This will hopefully change in the future, and would be a 
    much better solution if so.

    When updating to new versions of React Native or Expo, please take care to evaluate that this plugin still functions.
*/

const { withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withAndroidSigningConfig(config) {
    const signingConfig = `
        release {
            if (project.hasProperty('CBR_UPLOAD_STORE_FILE')) {
                storeFile file(CBR_UPLOAD_STORE_FILE)
                storePassword CBR_UPLOAD_STORE_PASSWORD
                keyAlias CBR_UPLOAD_KEY_ALIAS
                keyPassword CBR_UPLOAD_KEY_PASSWORD
            }
        }`;

    return withAppBuildGradle(config, (config) => {
        config.modResults.contents = config.modResults.contents.replace(
            /signingConfigs \{([\s\S]*?)\}/, // Modify existing signingConfigs without removing debug
            (match) => {
                if (/release \{/.test(match)) {
                    return match.replace(/release \{([\s\S]*?)\}/, signingConfig);
                }
                return match.trim() + signingConfig;
            }
        );

        config.modResults.contents = config.modResults.contents.replace(
            /buildTypes \{([\s\S]*?)release \{([\s\S]*?)signingConfig signingConfigs\.debug/, // Ensure release config uses signingConfigs.release
            `buildTypes { $1release { $2signingConfig signingConfigs.release`
        );

        return config;
    });
};
