const {
    withAppBuildGradle,
    withProjectBuildGradle,
    withDangerousMod,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const ANDROID_TEST_MANIFEST = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <application>
        <activity
            android:name="androidx.test.core.app.InstrumentationActivityInvoker$BootstrapActivity"
            android:exported="true"
            tools:replace="android:exported" />
        <activity
            android:name="androidx.test.core.app.InstrumentationActivityInvoker$EmptyActivity"
            android:exported="true"
            tools:replace="android:exported" />
        <activity
            android:name="androidx.test.core.app.InstrumentationActivityInvoker$EmptyFloatingActivity"
            android:exported="true"
            tools:replace="android:exported" />
    </application>
</manifest>
`;

const DETOX_TEST_JAVA = `package org.hopehealthaction.cbrapp;

import com.wix.detox.Detox;
import com.wix.detox.config.DetoxConfig;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class DetoxTest {
    @Rule
    public ActivityTestRule<MainActivity> mActivityRule = new ActivityTestRule<>(MainActivity.class, false, false);

    @Test
    public void runDetoxTests() {
        DetoxConfig detoxConfig = new DetoxConfig();
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 90;
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60;
        detoxConfig.rnContextLoadTimeoutSec = (BuildConfig.DEBUG ? 180 : 60);

        Detox.runTests(mActivityRule, detoxConfig);
    }
}
`;

const NETWORK_SECURITY_CONFIG = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
`;

function withDetoxProjectBuildGradle(config) {
    return withProjectBuildGradle(config, (config) => {
        let contents = config.modResults.contents;

        if (!contents.includes("Detox-android")) {
            contents = contents.replace(
                /(allprojects\s*\{[\s\S]*?repositories\s*\{)/,
                '$1\n        maven { url("$rootDir/../node_modules/detox/Detox-android") }'
            );
        }

        config.modResults.contents = contents;
        return config;
    });
}

function withDetoxAppBuildGradle(config) {
    return withAppBuildGradle(config, (config) => {
        let contents = config.modResults.contents;

        if (!contents.includes("testInstrumentationRunner")) {
            contents = contents.replace(
                /(defaultConfig\s*\{[^}]*)(})/,
                "$1        testBuildType System.getProperty('testBuildType', 'debug')\n        testInstrumentationRunner \"androidx.test.runner.AndroidJUnitRunner\"\n    $2"
            );
        }

        if (!contents.includes("com.wix:detox")) {
            contents = contents.replace(
                /(dependencies\s*\{)/,
                "$1\n    androidTestImplementation('com.wix:detox:+')\n    implementation 'androidx.appcompat:appcompat:1.1.0'"
            );
        }

        config.modResults.contents = contents;
        return config;
    });
}

function withDetoxTestFiles(config) {
    return withDangerousMod(config, [
        "android",
        async (config) => {
            const platformRoot = config.modRequest.platformProjectRoot;

            const javaDir = path.join(
                platformRoot,
                "app",
                "src",
                "androidTest",
                "java",
                "org",
                "hopehealthaction",
                "cbrapp"
            );
            fs.mkdirSync(javaDir, { recursive: true });
            fs.writeFileSync(path.join(javaDir, "DetoxTest.java"), DETOX_TEST_JAVA);

            const androidTestDir = path.join(platformRoot, "app", "src", "androidTest");
            fs.writeFileSync(
                path.join(androidTestDir, "AndroidManifest.xml"),
                ANDROID_TEST_MANIFEST
            );

            const xmlDir = path.join(platformRoot, "app", "src", "main", "res", "xml");
            fs.mkdirSync(xmlDir, { recursive: true });
            const nscPath = path.join(xmlDir, "network_security_config.xml");
            if (!fs.existsSync(nscPath)) {
                fs.writeFileSync(nscPath, NETWORK_SECURITY_CONFIG);
            }

            const mainManifestPath = path.join(
                platformRoot,
                "app",
                "src",
                "main",
                "AndroidManifest.xml"
            );
            if (fs.existsSync(mainManifestPath)) {
                let manifest = fs.readFileSync(mainManifestPath, "utf8");
                if (!manifest.includes("networkSecurityConfig")) {
                    manifest = manifest.replace(
                        /<application/,
                        '<application\n        android:networkSecurityConfig="@xml/network_security_config"'
                    );
                    fs.writeFileSync(mainManifestPath, manifest);
                }
            }

            return config;
        },
    ]);
}

module.exports = function withDetoxTest(config) {
    config = withDetoxProjectBuildGradle(config);
    config = withDetoxAppBuildGradle(config);
    config = withDetoxTestFiles(config);
    return config;
};
