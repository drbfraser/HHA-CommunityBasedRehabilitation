import { Endpoint } from "../../util/endpoints";
import { getAuthToken } from "../../util/auth";

export const RequestConfigBuilder = {
    /*
    TODO:
      create a ConfigEntity class to build more complex config
      now it is only with httpMethod and endpoint
  */
    buildConfig: async (
        httpMethod: string,
        body: any = "",
        endpoint: Endpoint,
        userId: string = ""
    ) => {
        const authToken = await getAuthToken();
        if (authToken === null) {
            return Promise.reject("unable to get an access token");
        }

        return {
            method: `${httpMethod}`,
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
            url: `http://localhost:8000/api/${endpoint}`,
        };
    },
};
