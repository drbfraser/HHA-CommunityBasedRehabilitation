import base64url from "base64url";
import { IAPIToken, setAccessToken, setRefreshToken } from "../../src/util/internal/tokens";

const JWT_JOSE_HEADER: string = base64url.encode(
    JSON.stringify({
        typ: "JWT",
        alg: "HS256",
    }),
);

/**
 * A static, fake JSON Web Signature for completeness. We don't check signatures, so it's
 * fine to have this as a constant.
 */
const FAKE_JWS_SIGNATURE = "ktkMgaQJFU83ds642P+8fMBv9UqhEQW3oVUkIlE/0PA";

const FAKE_JTI = "97cf729673794d518c82240f3b59ee47";

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
            jti: FAKE_JTI,
            user_id: 1,
        } as IAPIToken),
    );

    return JWT_JOSE_HEADER + "." + jwtClaimsSet + "." + FAKE_JWS_SIGNATURE;
};

export const addValidTokens = async () => {
    await setAccessToken(createFakeToken("access", false));
    await setRefreshToken(createFakeToken("refresh", false));
};
