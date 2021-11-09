import { apiFetch, Endpoint,createApiFetchRequest } from "../util/endpoints";
import { getAuthToken } from "../util/auth";
import { commonConfiguration } from "../init";
import { RequestConfigBuilder,ConfigEntity } from  "./tools/RequestConfigBuilder";

/*
//Trial of Axios, comment it out for testings
const addClient = async (clientInfo: FormData) => {

  const configEntity : ConfigEntity = RequestConfigBuilder.buildConfig("POST", clientInfo, Endpoint.CLIENTS,"");

  return await apiFetch(configEntity.endpoint, configEntity.userId, configEntity.init)
      .then((res) => {
          const tempRes:any = res.json();
          console.log("------1------");
          console.log(tempRes);
          return tempRes;
      })
      .then((res) => {
          console.log("------2------");
          console.log(res);
          return res;
      });
};

export default addClient;
*/

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

export class ConfigEntity {
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

const buildConfig = async(method: string, clientInfo: any, endpoint: Endpoint, userId: string) => {
  const authToken = await getAuthToken();
  if (authToken === null) {
      return Promise.reject("unable to get an access token");
  }
  const authorization:string =  `Bearer ${authToken}`;

  const url:any = createApiFetchRequest(endpoint,"");

  return new ConfigEntity(method, url, clientInfo, endpoint, );
}

const addClient = async (clientInfo: FormData) => {

  const configEntity : Promise<ConfigEntity> = buildConfig("POST", clientInfo, Endpoint.CLIENTS,"");

  console.log(configEntity);

  const res = await axios(configEntity);

  console.log(res);

  return res;

};

export default addClient;
