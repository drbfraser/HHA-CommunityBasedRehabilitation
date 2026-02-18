require("dotenv").config({ path: ".env.e2e" });

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
    rootDir: "..",
    testMatch: ["<rootDir>/e2e/**/*.test.js"],
    testTimeout: 360000,
    globalSetup: "./e2e/globalSetup.js",
    globalTeardown: "detox/runners/jest/globalTeardown",
    reporters: ["detox/runners/jest/reporter"],
    testEnvironment: "detox/runners/jest/testEnvironment",
    verbose: true,
};
