import { createContext } from "react";

export const AuthContext = createContext<IAuthContext>({
    // setup some dummy interface as the defaultValue
    login(username: string, password: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            resolve(false);
        });
    },
    logout() {},
});

export interface IAuthContext {
    login(username: string, password: string): Promise<boolean>;

    logout(): void;
}
