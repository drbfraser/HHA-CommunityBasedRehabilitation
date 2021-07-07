import { commonConfiguration, initializeCommon, reinitializeCommon } from "../src/init";
import * as TestCommonConfig from "./testHelpers/testCommonConfiguration";

beforeAll(() => {
    // Mock FormData, as FormData isn't available in a nodejs environment.
    // https://stackoverflow.com/a/59726560
    // @ts-ignore
    global.FormData = () => {};

    initializeCommon(TestCommonConfig.testCommonConfig);
});

beforeEach(() => {
    TestCommonConfig.testKeyValStorage.clear();
    reinitializeCommon(TestCommonConfig.testCommonConfig);
});
