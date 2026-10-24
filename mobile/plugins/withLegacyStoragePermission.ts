/*
    Expo plugin to declare WRITE_EXTERNAL_STORAGE for Android 9 (API 28) and older only.

    expo-image-picker's launchCameraAsync() requires WRITE_EXTERNAL_STORAGE on Android < 10, so blocking
    the permission entirely (android.blockedPermissions in app.json) made the camera fail on those devices.
    Limiting it with maxSdkVersion="28" means Android 10+ devices never see the permission.

    tools:node="replace" is needed because expo-image-picker's own manifest declares the permission without
    maxSdkVersion, and the manifest merger would otherwise drop the limit.
*/

const { withAndroidManifest } = require("@expo/config-plugins");

const PERMISSION = "android.permission.WRITE_EXTERNAL_STORAGE";

module.exports = function withLegacyStoragePermission(config) {
    return withAndroidManifest(config, (config) => {
        const manifest = config.modResults.manifest;
        manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";

        const permissions = (manifest["uses-permission"] ?? []).filter(
            (permission) => permission.$["android:name"] !== PERMISSION
        );
        permissions.push({
            $: {
                "android:name": PERMISSION,
                "android:maxSdkVersion": "28",
                "tools:node": "replace",
            },
        });
        manifest["uses-permission"] = permissions;

        return config;
    });
};
