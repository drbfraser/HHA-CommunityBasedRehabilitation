import { initializeCommon, reinitializeCommon } from "../src/init";
import * as TestCommonConfig from "./testHelpers/testCommonConfiguration";
import AbortController from "node-abort-controller";
import { Request } from "node-fetch";

// React 19 + @testing-library/react-hooks in a non-DOM Jest environment requires this flag
// so async state updates are tracked as act-compatible in tests.
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

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
