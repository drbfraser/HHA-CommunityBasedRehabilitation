import { Endpoint } from "../../util/endpoints";

interface Config {
    init: RequestInit;
    userId: number;
    endpoint: Endpoint;
}

class RequestInitEntity {
    method: string;
    body: any;
    constructor(method: string, body: any) {
        this.method = method;
        this.body = body;
    }
}

export class ConfigEntity {
    userId: string;
    endpoint: Endpoint;
    init: RequestInit;

    constructor(userId: string, httpMethod: string, endpoint: Endpoint, body: any) {
        this.userId = userId;
        this.endpoint = endpoint;
        this.init = new RequestInitEntity(httpMethod, body);
    }
}

export const RequestConfigBuilder = {
    buildConfig: (httpMethod: string, body: any, endpoint: Endpoint, userId: string) => {
        return new ConfigEntity(userId, httpMethod, endpoint, body);
    },
};
