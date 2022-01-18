import { Endpoint } from "../util/endpoints";
import { getAuthToken } from "../util/auth";
import { RequestConfigBuilder } from "./tools/RequestConfigBuilder";
import { IAlert } from "../util/alerts";

declare var require: any;

const axios = require("axios");

export enum PriorityLevel {
    LOW = "LO",
    MEDIUM = "ME",
    HIGH = "HI",
}

export const alertServices = {
    showAlerts: async () => {
        try {
            const config = await RequestConfigBuilder.buildConfig("get", "", Endpoint.ALERTS, "");

            const tempAlerts: IAlert[] = (await axios(config)).data;

            return tempAlerts;
        } catch (e) {
            console.log(`Error fetching Alerts: ${e}`);
        }
    },
};
