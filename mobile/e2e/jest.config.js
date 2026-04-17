require("dotenv").config({ path: ".env.e2e" });

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
    rootDir: "..",
    testMatch: ["**/login.test*", "**/sync.test*"],
    testTimeout: 360000,
    maxWorkers: 1,
    testSequencer: "./e2e/testSequencer.js",
    globalSetup: "./e2e/globalSetup.js",
    globalTeardown: "detox/runners/jest/globalTeardown",
    reporters: ["detox/runners/jest/reporter"],
    testEnvironment: "detox/runners/jest/testEnvironment",
    verbose: true,
};
