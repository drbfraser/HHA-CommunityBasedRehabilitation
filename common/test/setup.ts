import { initializeCommon, reinitializeCommon } from "../src/init";
import * as TestCommonConfig from "./testHelpers/testCommonConfiguration";
import AbortController from "node-abort-controller";
import { Request } from "node-fetch";

// @ts-expect-error: TODO node-abort-controller should no longer be needed, as Node
// has AbortController as a builtin global as of v15.  For now, the common tests
// still work with this polyfill
global.AbortController = AbortController;

// Mock FormData, as FormData isn't available in a nodejs environment.
// https://stackoverflow.com/a/59726560
// @ts-ignore
global.FormData = () => {};

// @ts-expect-error: TODO
global.Request = Request;

beforeAll(() => {
    initializeCommon(TestCommonConfig.testCommonConfig);
});

beforeEach(() => {
    TestCommonConfig.testKeyValStorage.clear();
    reinitializeCommon(TestCommonConfig.testCommonConfig);
});
