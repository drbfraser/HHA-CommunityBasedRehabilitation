import { commonConfiguration, initializeCommon } from "../src/init";
import * as TestCommonConfig from "./testHelpers/testCommonConfiguration";

beforeEach(() => {
    TestCommonConfig.testKeyValStorage.clear();
    // Empty it out
    while (TestCommonConfig.logoutCallbacks.pop()) {}
    if (!commonConfiguration) {
        initializeCommon(TestCommonConfig.testCommonConfig);
    }
});
