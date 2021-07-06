import base64url from "base64url";
import { IAPIToken, setAccessToken, setRefreshToken } from "../../src/util/internal/tokens";

const jwtJoseHeader: string = base64url.encode(
    JSON.stringify({
        typ: "JWT",
        alg: "HS256",
    })
);
// just a static signature because we don't verify the signatures
const fakeJwsSignature = "ktkMgaQJFU83ds642P+8fMBv9UqhEQW3oVUkIlE/0PA";
/**
 * Creates a fake token for testing
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7519
 * @param tokenType Access or refresh
 * @param expireNow Whether to create an already-expired token
 */
export const createFakeToken = (tokenType: "access" | "refresh", expireNow: boolean): string => {
    const jwtClaimsSet: string = base64url.encode(
        JSON.stringify({
            token_type: tokenType,
            exp: expireNow ? 1000 : Date.now() / 1000 + 120,
            jti: "97cf729673794d518c82240f3b59ee47",
            user_id: 1,
        } as IAPIToken)
    );

    return jwtJoseHeader + "." + jwtClaimsSet + "." + fakeJwsSignature;
};

export const addValidTokens = async () => {
    await setAccessToken(createFakeToken("access", false));
    await setRefreshToken(createFakeToken("refresh", false));
};
