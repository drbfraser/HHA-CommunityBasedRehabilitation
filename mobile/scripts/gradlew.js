const { execSync } = require("child_process");
const path = require("path");

const args = process.argv.slice(2).join(" ");
const isWin = process.platform === "win32";
const cmd = isWin ? `gradlew.bat ${args}` : `./gradlew ${args}`;

execSync(cmd, {
    stdio: "inherit",
    cwd: path.join(__dirname, "..", "android"),
});
