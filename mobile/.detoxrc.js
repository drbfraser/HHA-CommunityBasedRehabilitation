/** @type {Detox.DetoxConfig} */
module.exports = {
    testRunner: {
        args: {
            $0: "jest",
            config: "e2e/jest.config.js",
        },
        jest: {
            setupTimeout: 300000,
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
                avdName: "Pixel_6",
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
