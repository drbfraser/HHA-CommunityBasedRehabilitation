import { initializeCommon, reinitializeCommon } from "../src/init";
import * as TestCommonConfig from "./testHelpers/testCommonConfiguration";
import { Request } from "node-fetch";

beforeAll(() => {
    // Mock FormData, as FormData isn't available in a nodejs environment.
    // https://stackoverflow.com/a/59726560
    // @ts-ignore
    global.FormData = () => {};
    global.Request = Request;

beforeAll(() => {
    initializeCommon(TestCommonConfig.testCommonConfig);
});

beforeEach(() => {
    TestCommonConfig.testKeyValStorage.clear();
    reinitializeCommon(TestCommonConfig.testCommonConfig);
});
