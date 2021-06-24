import { IUser } from "@cbr/common";

export namespace AuthState {
    /**
     * The state where the user is logged in (refresh token is valid).
     *
     * Note: This also covers the following case: If the user has no internet, they can't refresh
     * tokens, so they end up with an invalid access token but a valid (not-expired) refresh token.
     */
    export interface LoggedIn {
        readonly state: "loggedIn";
        readonly currentUser: IUser;
    }

    /**
     * The state where the user was previously logged in, but the refresh token has expired.
     * The {@link currentUser} property contains the information of the user that was previously
     * logged into the app.
     */
    export interface PreviouslyLoggedIn {
        readonly state: "previouslyLoggedIn";
        readonly currentUser: IUser;
    }

    /**
     * The state where the user hasn't logged in at all (either by explicit logout or first-time
     * startup)
     */
    export interface LoggedOut {
        readonly state: "loggedOut";
    }

    /**
     * The state where the user's authentication state hasn't been read from disk yet.
     */
    export interface Unknown {
        readonly state: "unknown";
    }
}

/**
 * Encapsulates the authentication state for the app.
 * @see AuthContext
 * @see IAuthContext
 */
export type AuthState =
    | AuthState.LoggedIn
    | AuthState.PreviouslyLoggedIn
    | AuthState.LoggedOut
    | AuthState.Unknown;
