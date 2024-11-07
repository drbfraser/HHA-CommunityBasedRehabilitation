import "i18next";

import Resources from "./resources.ts";

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: "en";
        resources: Resources;
    }
}
