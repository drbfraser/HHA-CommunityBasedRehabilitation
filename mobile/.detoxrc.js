/** @type {Detox.DetoxConfig} */
// Load test env vars from .env.e2e so DETOX_AVD_NAME can be defined there
try {
    require("dotenv").config({ path: ".env.e2e" });
} catch (e) {
    /* noop if dotenv not available */
}

module.exports = {
    artifacts: {
        rootDir: "e2e/artifacts",
        pathBuilder: "./e2e/artifactPathBuilder.js",
        plugins: {
            log: { enabled: true },
            screenshot: {
                enabled: true,
                shouldTakeAutomaticSnapshots: true,
                keepOnlyFailedTestsArtifacts: false,
                takeWhen: { testStart: false, testDone: true },
            },
            video: {
                enabled: true,
                keepOnlyFailedTestsArtifacts: false,
            },
        },
    },
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
            build:
                process.platform === "win32"
                    ? "cd android && gradlew.bat :app:assembleDebug :app:assembleAndroidTest -DtestBuildType=debug"
                    : "cd android && ./gradlew :app:assembleDebug :app:assembleAndroidTest -DtestBuildType=debug",
            reversePorts: [8081, 8000],
        },
        "android.release": {
            type: "android.apk",
            binaryPath: "android/app/build/outputs/apk/release/app-release.apk",
            build:
                process.platform === "win32"
                    ? "cd android && gradlew.bat assembleRelease"
                    : "cd android && ./gradlew assembleRelease",
        },
    },
    devices: {
        attached: {
            type: "android.attached",
            device: {
                // allow override via environment variable so CI can target a specific emulator
                adbName: process.env.DETOX_ADB_NAME || ".*",
            },
        },
        emulator: {
            type: "android.emulator",
            device: {
                // allow override via environment variable (DETOX_AVD_NAME) — fall back to the repo default
                avdName: process.env.DETOX_AVD_NAME || "Pixel_6_API_30",
            },
            headless: true,
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
