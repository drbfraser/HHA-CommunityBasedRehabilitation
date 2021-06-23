import { createContext } from "react";
import { AuthState } from "./AuthState";
import App from "../../App";

/**
 * A Context holding the authentication state for the app. This should be used for user login and
 * logout over the common package's login and logout functions.
 */
export const AuthContext = createContext<IAuthContext>({
    // Setup some dummy interface as the defaultValue for type-safety reasons.
    // This isn't expected to be used at all, since the App component should provide the
    // AuthContext for all other components. The actual implementation is in the App component.
    login: async (username: string, password: string): Promise<boolean> => {
        console.error("dummy AuthContext shouldn't be used, but login was called");
        return false;
    },
    logout: async () => {
        console.error("dummy AuthContext shouldn't be used, but logout was called");
    },
    requireLoggedIn: async (updateUserFromServer: boolean): Promise<void> => {
        console.error("dummy AuthContext shouldn't be used, but requireLoggedIn was called");
    },
    authState: { state: "unknown" },
});

export interface IAuthContext {
    /**
     * Performs a login by submitting the credentials to the server and attempts to receive an
     * access token, a refresh token, and the details of the current user. The login is considered
     * successful if the app is able to both get the tokens and get the details of the current user.
     *
     * {@link authState} will change to {@link AuthState.LoggedIn} if login is successful, causing
     * the user to be taken to the logged-in screens (see {@link screensForUser and the {@link App}
     * component}.
     *
     * @return A Promise resolving to whether the login was successful. Note: Resolving to `true`
     * means the screen will be changed to the logged-in flow (see the {@link App} component).
     * @param username The username to submit to the server. This might be case sensitive---check
     * the backend to be sure.
     * @param password The password to submit to the server.
     */
    login(username: string, password: string): Promise<boolean>;

    /**
     * Logs out the user. This is meant to be used when the user explicitly chooses to logout
     * (they press a logout button). All data stored in the app (auth tokens, cached API data, etc.)
     * will be deleted.
     *
     * {@link authState} will change to {@link AuthState.LoggedOut} if logout is successful, causing
     * the user to be taken back to the login screen.
     */
    logout(): Promise<void>;

    /**
     * Checks whether the user is logged in (i.e., refresh token is valid).
     *
     * If the user is logged in, an attempt to refresh the access and refresh tokens will be made
     * if they're close to expiry.
     *
     * {@link authState} will be changed to {@link AuthState.LoggedOut} if the user is considered
     * to be fully logged out (no refresh tokens and no cached user data), causing the user to be
     * forcefully navigated to the login screen.
     *
     * {@link authState} will be changed to {@link AuthState.PreviouslyLoggedIn} if the user was
     * logged in before but their refresh token expires (e.g., offline too long and can't refresh
     * the refresh token, or the phone's OS kills the app and the user doesn't use it for a while).
     * In this case, the user is taken to the login screen, but the data in the app is not expected
     * to be lost or deleted, unless they explicitly press the logout button presented to them. This
     * should be used with care when dealing with unsaved data, e.g., forcing them out to the login
     * screen before they can save will lose all of their input.
     *
     * @param tryUpdateUserFromServer Whether to additionally attempt to update the local cache of
     * the user's info if the user is logged in. If the fetch fails, the user is not logged out.
     * For screens that do not have dependency on the current user's details, they shouldn't set
     * this as true in order to not run excess network calls.
     */
    requireLoggedIn(tryUpdateUserFromServer: boolean): Promise<void>;

    /**
     * The current {@link AuthState} of the app. This can be used to retrieve the current user
     * details (check if it's {@link AuthState.LoggedIn} first).
     */
    readonly authState: Readonly<AuthState>;
}
