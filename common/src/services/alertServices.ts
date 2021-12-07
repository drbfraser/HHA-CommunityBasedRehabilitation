import { Endpoint } from "../util/endpoints";
import { getAuthToken } from "../util/auth";
import { RequestConfigBuilder } from "./tools/RequestConfigBuilder";
import { Time } from "../util/time";

declare var require: any;

const axios = require("axios");

export enum PriorityLevel {
    LOW = "LO",
    MEDIUM = "ME",
    HIGH = "HI",
}

interface IAlert {
    id: number;
    subject: string;
    priority: PriorityLevel;
    alert_message: string;
    unread_by_users: string[];
    created_by_user: number;
    created_date: Time;
}

export const alertServices = {
    showAlerts: async () => {
        try {
            const authToken = await getAuthToken();
            if (authToken === null) {
                return Promise.reject("unable to get an access token");
            }

            const config = await RequestConfigBuilder.buildConfig("get", "", Endpoint.ALERTS, "");

            const tempAlerts: IAlert[] = (await axios(config)).data;

            return tempAlerts;
        } catch (e) {
            console.log(`Error fetching Alerts: ${e}`);
        }
    },
};
