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
    try {
        const [, base64Jwt] = (request.headers["Authorization"] as string).split(" ");
        const token: IAPIToken = jwt_decode(base64Jwt);
        if (token.token_type === "access" && isTokenValid(base64Jwt)) {
            return null;
        } else {
            return { status: 401 };
        }
    } catch (e) {
        return { status: 501 };
    }
};
