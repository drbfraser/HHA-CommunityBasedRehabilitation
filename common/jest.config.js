/**
 * @type {import("ts-jest/dist/types").InitialOptionsTsJest}
 */
module.exports = {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "jsdom",
    collectCoverageFrom: ["./src/**/*.ts"],
    coverageReporters: ["text", "cobertura"],
    setupFilesAfterEnv: ["./test/setup.ts"],
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json",
            isolatedModules: true,
        },
    },
};
