import { useEffect, useState } from "react";
import { isLoggedIn } from "@cbr/common/util/auth";

type LoginStateListener = (isLoggedInNow: boolean) => void;

class LoginStateEmitter {
    private listeners: LoginStateListener[] = [];
    private loggedIn: boolean | undefined = undefined;

    isLoggedIn(): boolean | undefined {
        return this.loggedIn;
    }

    register(listener: LoginStateListener) {
        this.listeners.push(listener);

        if (this.loggedIn) {
            listener(this.loggedIn);
        } else {
            // This will lazily initialize the login state from the common package if needed.
            // We can't handle this in the constructor, because the common package might not
            // be initialized at that point.
            isLoggedIn().then((loginState) => {
                this.emit(loginState);
            });
        }
    }

    unregister(listener: LoginStateListener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    emit(newLoggedInState: boolean) {
        this.loggedIn = newLoggedInState;
        this.listeners.forEach((l) => l(newLoggedInState));
    }
}

export const loginState = new LoginStateEmitter();

export const useIsLoggedIn = (): boolean | undefined => {
    // Opportunistically use the initialized loggedIn state. If loginState.isLoggedIn() returns
    // undefined, the registration of the listener will resolve the state to a defined boolean.
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(loginState.isLoggedIn());

    useEffect(() => {
        const listener = (isLoggedInNow: boolean) => {
            setIsLoggedIn(isLoggedInNow);
        };
        loginState.register(listener);

        return () => {
            loginState.unregister(listener);
        };
    }, []);

    return isLoggedIn;
};
