import { apiFetch, Endpoint } from "../util/endpoints";
import { RequestConfigBuilder,ConfigEntity } from  "./tools/RequestConfigBuilder";

/*
Trial of Axios, comment it out for testings
const addClient = async (clientInfo: FormData) => {

  const configEntity : ConfigEntity = RequestConfigBuilder.buildConfig("POST", clientInfo, Endpoint.CLIENTS,"");

  return await apiFetch(configEntity.endpoint, configEntity.userId, configEntity.init)
      .then((res) => {
          return res.json();
      })
      .then((res) => {
          return res;
      });
};

export default addClient;
*/
const axios = require('axios');

const addClient = async (clientInfo: FormData) => {

  const configEntity : ConfigEntity = RequestConfigBuilder.buildConfig("POST", clientInfo, Endpoint.CLIENTS,"");

  return await apiFetch(configEntity.endpoint, configEntity.userId, configEntity.init)
      .then((res) => {
          return res.json();
      })
      .then((res) => {
          return res;
      });
};

export default addClient;