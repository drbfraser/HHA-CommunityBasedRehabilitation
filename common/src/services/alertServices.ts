import { apiFetch, Endpoint,createApiFetchRequest } from "../util/endpoints";
import { getAuthToken } from "../util/auth";
import { commonConfiguration } from "../init";
import { RequestConfigBuilder } from  "./tools/RequestConfigBuilder";
import { Time } from "@cbr/common/util/time";

declare var require: any

const axios = require('axios');

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
  created_by_user: number;
  created_date: Time;
}

const alertServices = {
  showAlerts : async () => {
    try {
        const authToken = await getAuthToken();
        if (authToken === null) {
            return Promise.reject("unable to get an access token");
        }

        const config = await RequestConfigBuilder.buildConfig('get','', 'alerts','');

        console.log("1. ------")
        console.log(config);
        console.log("2. ------")
        // const tempAlerts: IAlert[] = (await axios({
        //   method:'get',
        //   headers: {
        //     Authorization: `Bearer ${authToken}`,
        //     'Content-Type':'application/json'
        //   },
        //   url:'http://localhost:8000/api/alerts'
        // })).data; 

        const tempAlerts: IAlert[] = (await axios(config)).data;

        console.log("FLAG 10-----");
        console.log(tempAlerts);
        console.log("FLAG 11-----");
        return tempAlerts;
    } catch (e) {
        console.log(`Error fetching Alerts: ${e}`);
    }
}
}

export default alertServices;