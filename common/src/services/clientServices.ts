import { apiFetch, APIFetchFailError, Endpoint, objectToFormData } from "../util/endpoints";

const addClient = async (clientInfo: FormData) => {
  const init: RequestInit = {
      method: "POST",
      body: clientInfo,
  };

  return await apiFetch(Endpoint.CLIENTS, "", init)
      .then((res) => {
          return res.json();
      })
      .then((res) => {
          return res;
      });
};

export default addClient;