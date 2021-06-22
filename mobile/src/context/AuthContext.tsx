import { createContext } from "react";
import { AuthState } from "../util/AuthState";

export const AuthContext = createContext<IAuthContext>({
    // setup some dummy interface as the defaultValue for type-safety reasons
    // this isn't expected to be used at all, since the App component should provide the
    // AuthContext for all other components
    login(username: string, password: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => resolve(false));
    },
    logout() {
        return new Promise<void>((resolve) => resolve());
    },
    requireLoggedIn(updateUserFromServer: boolean): Promise<void> {
        return new Promise<void>((resolve) => resolve());
    },
    authState: { state: "unknown" },
});

export interface IAuthContext {
    login(username: string, password: string): Promise<boolean>;
    logout(): Promise<void>;

    /**
     * Checks whether the user is logged in (i.e., refresh token is valid).
     *
     * If the user is considered logged out, {@link authState} will be updated and the user will be
     * forcefully navigated to the login screen. This can be used to require the user to be logged in on
     * certain screens.
     *
     * If the user is logged in, an attempt to refresh the access and refresh tokens will be made
     * if they're close to expiry.
     *
     * If the user was logged in before but their refresh token expires (e.g., offline too long and
     * can't refresh the refresh token), they'll be forced to the login screen, but the data in the
     * app is not expected to be lost, unless they explicitly press the logout button presented to
     * them. As such, this should be used with care when dealing with unsaved data, e.g., forcing
     * them out to the login screen before they can save will lose all of their input.
     *
     * @param tryUpdateUserFromServer Whether to additionally attempt to update the local cache of
     * the user's info if the user is logged in. If the fetch fails, the user is not logged out.
     * For screens that do not have dependency on the current user's details, they shouldn't set
     * this as true in order to not run excess network calls.
     */
    requireLoggedIn(tryUpdateUserFromServer: boolean): Promise<void>;
    readonly authState: Readonly<AuthState>;
}
