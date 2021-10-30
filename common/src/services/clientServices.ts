import { apiFetch, APIFetchFailError, Endpoint, objectToFormData } from "../util/endpoints";
import { RequestConfigBuilder,ConfigEntity } from  "./tools/RequestConfigBuilder";

const addClient = async (clientInfo: FormData) => {
  // const init: RequestInit = {
  //     method: "POST",
  //     body: clientInfo,
  // };

  const configEntity : ConfigEntity = RequestConfigBuilder.buildConfig("POST", clientInfo, Endpoint.CLIENTS,"");

  // return await apiFetch(Endpoint.CLIENTS, "", init)
  return await apiFetch(configEntity.endpoint, configEntity.userId, configEntity.init)
      .then((res) => {
          return res.json();
      })
      .then((res) => {
          return res;
      });
};

export default addClient;