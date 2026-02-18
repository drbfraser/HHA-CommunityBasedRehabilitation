/** @type {Detox.DetoxConfig} */
// Load test env vars from .env.e2e so DETOX_AVD_NAME can be defined there
try {
    require("dotenv").config({ path: ".env.e2e" });
} catch (e) {
    /* noop if dotenv not available */
}

module.exports = {
    testRunner: {
        args: {
            $0: "jest",
            config: "e2e/jest.config.js",
        },
        jest: {
            setupTimeout: 600000,
        },
    },
    apps: {
        "android.debug": {
            type: "android.apk",
            binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
            testBinaryPath:
                "android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk",
            build: "cd android && gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug",
            reversePorts: [8081],
        },
        "android.release": {
            type: "android.apk",
            binaryPath: "android/app/build/outputs/apk/release/app-release.apk",
            build: "cd android && gradlew assembleRelease",
        },
    },
    devices: {
        attached: {
            type: "android.attached",
            device: {
                adbName: ".*",
            },
        },
        emulator: {
            type: "android.emulator",
            device: {
                // allow override via environment variable (DETOX_AVD_NAME) — fall back to the repo default
                avdName: process.env.DETOX_AVD_NAME || "Medium_Phone_API_36.1",
            },
        },
    },
    configurations: {
        "android.att.debug": {
            device: "attached",
            app: "android.debug",
        },
        "android.att.release": {
            device: "attached",
            app: "android.release",
        },
        "android.emu.debug": {
            device: "emulator",
            app: "android.debug",
        },
        "android.emu.release": {
            device: "emulator",
            app: "android.release",
        },
    },
};
