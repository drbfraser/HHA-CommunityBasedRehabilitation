const process = require("process");
const path = require("path");
const { spawnSync } = require("child_process");

const IS_WINDOWS = process.platform === "win32";
const VALID_BUILD_TYPES = ["debug", "release"];
const VALID_ENVS = ["local", "dev", "staging", "prod"];

let buildType = process.argv.length === 4 ? process.argv[2] : "";
let appEnv = process.argv.length === 4 ? process.argv[3] : "";

if (!VALID_BUILD_TYPES.includes(buildType) || !VALID_ENVS.includes(appEnv)) {
    console.error(
        "Usage: npm run build [type] [env], where [type] is one of: " +
            VALID_BUILD_TYPES.join(", ") +
            " and env is one of: " +
            VALID_ENVS.join(", ")
    );
    process.exit(1);
}

const buildTypeToCommand = {
    debug: "assembleDebug",
    release: "assembleRelease",
};

const { status } = spawnSync(`${IS_WINDOWS ? "" : "./"}gradlew`, [buildTypeToCommand[buildType]], {
    env: { ...process.env, APP_ENV: appEnv },
    cwd: path.join(__dirname, "android"),
    stdio: "inherit",
    shell: true,
});

process.exit(status);
