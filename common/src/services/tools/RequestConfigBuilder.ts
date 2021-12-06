import { Endpoint } from "../../util/endpoints";
import { getAuthToken } from "../../util/auth";

interface Config {
  init: RequestInit,
  userId: number,
  endpoint: Endpoint
}

class RequestInitEntity {
  method:string;
  body:any;
  constructor(method:string, body:any) {
    this.method = method;
    this.body = body;
  }
}

export class ConfigEntity {
  userId: string;
  endpoint: Endpoint;
  init: RequestInit;

  constructor(userId: string, httpMethod: string, endpoint:Endpoint, body:any) {
    this.userId = userId;
    this.endpoint = endpoint;
    this.init = new RequestInitEntity(httpMethod,body);
  }
}

export const RequestConfigBuilder = {
  buildConfig: async (httpMethod:string, body:any, endpoint: string ,userId:string) => {

    const authToken = await getAuthToken();
    if (authToken === null) {
        return Promise.reject("unable to get an access token");
    }

    // return new ConfigEntity(userId, httpMethod, endpoint, body);
    return {
      method:`${httpMethod}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type':'application/json'
      },
      url:`http://localhost:8000/api/${endpoint}`
    };
  }
}