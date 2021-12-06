import { apiFetch, Endpoint,createApiFetchRequest } from "../util/endpoints";
import { getAuthToken } from "../util/auth";
import { commonConfiguration } from "../init";
import { RequestConfigBuilder } from  "./tools/RequestConfigBuilder";

declare var require: any

const axios = require('axios');

interface Config {
  method: string,
  url: string,
  header: Header,
  data: string,
}

interface Header {
  'Authorization': string,
  'Content-Type': string,
}

class HeaderEntity {
  'Authorization': string;
  'Content-Type': string;

  constructor(authorization: string, contentType: string) {
    this.Authorization = authorization;
    this['Content-Type'] = contentType;
  }
}

class ConfigEntity {
  method: string;
  url: string;
  header: Header;
  data: string;

  constructor(method: string, url: string, Authorization: string, data: string) {
    this.method = method;
    this.url = url;
    this.header = new HeaderEntity(Authorization,"");
    this.data = data;
  }
}

const buildConfig = async(method: string, alertInfo: any, endpoint: Endpoint, userId: string) => {
  const authToken = await getAuthToken();
  if (authToken === null) {
      return Promise.reject("unable to get an access token");
  }
  const authorization:string =  `Bearer ${authToken}`;

  const url:any = createApiFetchRequest(endpoint,"");

  return new ConfigEntity(method, url, endpoint, alertInfo);
}

const addClient = async (alertInfo: FormData) => {

  const configEntity : Promise<ConfigEntity> = buildConfig("POST", alertInfo, Endpoint.ALERT,"");

  console.log(configEntity);

  const res = await axios(configEntity);

  console.log(res);

  return res;

};

export default addClient;
