/*
    Expo plugin to exclude the app's main window from Android content capture (Android 11 / API 30+).

    Content capture (e.g. Android System Intelligence on Pixels) asks for an accessibility description of
    every view that appears or changes. React Native's ReactAccessibilityDelegate builds those descriptions
    by walking child views, and Android searches the whole window for each TextView's label, so the cost
    grows roughly with the square of the number of views. With large non-virtualized lists (e.g. ~750
    clients) this blocked the main thread for 4+ seconds when screens appeared, causing ANRs
    ("CBR isn't responding"). Excluding the window also keeps patient data on screen out of the
    content capture service. TalkBack and autofill are not affected.
*/

const { withMainActivity } = require("@expo/config-plugins");

const MARKER = "IMPORTANT_FOR_CONTENT_CAPTURE_NO_EXCLUDE_DESCENDANTS";
const IMPORTS = ["android.os.Build", "android.view.View"];
const CODE = `    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      window.decorView.importantForContentCapture =
          View.${MARKER}
    }
`;

function addContentCaptureExclusion(src) {
    if (src.includes(MARKER)) {
        return src;
    }

    const onCreate = /^.*super\.onCreate\([^)]*\).*\n/m;
    if (!onCreate.test(src)) {
        throw new Error(
            "withContentCaptureDisabled: super.onCreate() not found in MainActivity.kt"
        );
    }
    src = src.replace(onCreate, (line) => line + CODE);

    for (const imp of IMPORTS) {
        if (!new RegExp(`^import ${imp.replace(/\./g, "\\.")}$`, "m").test(src)) {
            src = src.replace(/^(package .*\n)/m, `$1import ${imp}\n`);
        }
    }
    return src;
}

module.exports = function withContentCaptureDisabled(config) {
    return withMainActivity(config, (config) => {
        if (config.modResults.language !== "kt") {
            throw new Error("withContentCaptureDisabled: only a Kotlin MainActivity is supported");
        }
        config.modResults.contents = addContentCaptureExclusion(config.modResults.contents);
        return config;
    });
};

module.exports.addContentCaptureExclusion = addContentCaptureExclusion;
