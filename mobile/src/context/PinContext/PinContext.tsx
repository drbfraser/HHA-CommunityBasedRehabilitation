import { createContext } from "react";
import { PinState } from "./PinState";

export interface IPinContext {
    readonly pinState: Readonly<PinState>;
    setPin(pin: string): Promise<void>;
    verifyPin(pin: string): Promise<boolean>;
    fallbackToPassword(): Promise<void>;
    /**
     * Runs `fn` with the app's PIN auto-lock suppressed. Use this to wrap flows
     * that intentionally background the app (e.g. the image picker / camera and
     * its permission dialogs) so the user is not bounced to the lock screen and
     * does not lose in-progress form state when they return.
     */
    runWithoutAutoLock<T>(fn: () => Promise<T>): Promise<T>;
}

const notProvided = (method: string) => () => {
    throw new Error(`PinContext.${method} called without a provider`);
};

export const PinContext = createContext<IPinContext>({
    pinState: { state: "unknown" },
    setPin: notProvided("setPin"),
    verifyPin: notProvided("verifyPin"),
    fallbackToPassword: notProvided("fallbackToPassword"),
    runWithoutAutoLock: notProvided("runWithoutAutoLock"),
});
