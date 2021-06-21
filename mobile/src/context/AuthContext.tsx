import { createContext } from "react";

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
});

export interface IAuthContext {
    login(username: string, password: string): Promise<boolean>;
    logout(): Promise<void>;
}
