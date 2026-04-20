import { createContext } from "react";
import { PinState } from "./PinState";

export interface IPinContext {
    readonly pinState: Readonly<PinState>;
    setPin(pin: string): Promise<void>;
    verifyPin(pin: string): Promise<boolean>;
    fallbackToPassword(): Promise<void>;
}

const notProvided = (method: string) => () => {
    throw new Error(`PinContext.${method} called without a provider`);
};

export const PinContext = createContext<IPinContext>({
    pinState: { state: "unknown" },
    setPin: notProvided("setPin"),
    verifyPin: notProvided("verifyPin"),
    fallbackToPassword: notProvided("fallbackToPassword"),
});
