import { commonConfiguration } from "../../init";

export interface IAPIToken {
    token_type: "access" | "refresh";
    exp: number;
    jti: string;
    user_id: number;
}

const ACCESS_TOKEN_KEY = "api_accessToken";
const REFRESH_TOKEN_KEY = "api_refreshToken";

export const getAccessToken = async (): Promise<string | null> => {
    return commonConfiguration.keyValStorageProvider.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = async (): Promise<string | null> => {
    return commonConfiguration.keyValStorageProvider.getItem(REFRESH_TOKEN_KEY);
};

export const setAccessToken = async (token: string): Promise<void> => {
    return commonConfiguration.keyValStorageProvider.setItem(ACCESS_TOKEN_KEY, token);
};

export const setRefreshToken = async (token: string): Promise<void> => {
    return commonConfiguration.keyValStorageProvider.setItem(REFRESH_TOKEN_KEY, token);
};

export const deleteTokens = async () => {
    await commonConfiguration.keyValStorageProvider.removeItem(ACCESS_TOKEN_KEY);
    await commonConfiguration.keyValStorageProvider.removeItem(REFRESH_TOKEN_KEY);
};
