/**
 * TODOSD: these build scripts do not currently work properly in the CI Pipeline.
 * In addition, they will currently also fail when manually making a release
 * build (due to the android directory being automatically regenerated).
 *
 * Instead, use ./gradlew assembleRelease (to build an APK) or ./gradlew bundleRelease
 * (to build an AAB) from within the android directory.  Be sure to update APP_ENV in
 * mobile/.env according to your desired target (local, dev, staging, or prod).
 */
const process = require("process");
const path = require("path");
const { spawn } = require("child_process");

const IS_WINDOWS = process.platform === "win32";
const VALID_TARGETS = ["local", "dev", "staging", "prod"];
const BUNDLE_FLAG = "--bundle";

let target = process.argv.length === 3 ? process.argv[2] : process.argv[3];

let gradleCommand =
    process.argv.length === 4 && process.argv[2] === BUNDLE_FLAG
        ? "bundleRelease"
        : "assembleRelease";

if (process.argv.length === 4 && process.argv[2] != BUNDLE_FLAG) {
    console.error("Unrecognized argument. Usage: npm run build " + BUNDLE_FLAG + " [target]");
    process.exit(1);
}

if (!VALID_TARGETS.includes(target)) {
    console.error(
        "Usage: npm run build [target], where target is one of: " + VALID_TARGETS.join(", ")
    );
    process.exit(1);
}

spawn(`${IS_WINDOWS ? "" : "./"}gradlew`, [gradleCommand], {
    env: { ...process.env, APP_ENV: target },
    cwd: path.join(__dirname, "android"),
    stdio: "inherit",
    shell: true,
});
