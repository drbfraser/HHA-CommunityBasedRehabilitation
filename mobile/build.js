const process = require("process");
const path = require("path");
const { spawn } = require("child_process");

const IS_WINDOWS = process.platform === "win32";
const VALID_TARGETS = ["local", "dev", "staging", "prod"];

let target = process.argv.length === 3 ? process.argv[2] : "";

if (!VALID_TARGETS.includes(target)) {
    console.error(
        "Usage: npm run build [target], where target is one of: " + VALID_TARGETS.join(", ")
    );
    process.exit(1);
}

spawn(`${IS_WINDOWS ? "" : "./"}gradlew`, ["assembleRelease"], {
    env: { ...process.env, APP_ENV: target },
    cwd: path.join(__dirname, "android"),
    stdio: "inherit",
    shell: true,
});
