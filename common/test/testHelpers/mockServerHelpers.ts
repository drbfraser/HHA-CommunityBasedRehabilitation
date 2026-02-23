import { MockRequest, MockResponseObject } from "fetch-mock";
import { isTokenValid } from "../../src/util/auth";
import jwt_decode from "jwt-decode";
import { IAPIToken } from "../../src/util/internal/tokens";

/**
 * Checks access token validity
 *
 * @param request A request with an Authorization header
 * @return A {@link MockResponseObject} if the auth header fails validation, or null if the auth
 * header passes. If not null, the response should be immediately returned.
 */
export const checkAuthHeader = (request: MockRequest): MockResponseObject | null => {
    const authorizationHeader = request.headers?.hasOwnProperty("Authorization")
        ? (request.headers["Authorization" as keyof HeadersInit] as string)
        : (request as Request).headers.get("Authorization");

    try {
        // for some reason, the node-fetch package treats headers as Map<String, Array<Map>>
        const [, base64Jwt] = (
            Array.isArray(authorizationHeader) ? authorizationHeader[0] : authorizationHeader
        ).split(" ");
        const token: IAPIToken = jwt_decode(base64Jwt);
        if (token.token_type === "access" && isTokenValid(base64Jwt)) {
            return null;
        } else {
            return { status: 401 };
        }
    } catch (e) {
        console.error(
            `Error when checking auth header: ${e}. Typeof auth header: ${JSON.stringify(
                authorizationHeader,
            )}. request: ${JSON.stringify(request)}`,
        );
        return { status: 555 };
    }
};
