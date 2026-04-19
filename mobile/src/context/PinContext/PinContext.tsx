import { createContext } from "react";
import { PinState } from "./PinState";

/**
 * A Context holding the local PIN-lock state for the app. This is separate from
 * {@link AuthContext}: auth verifies identity on the server, whereas the PIN unlocks the app
 * locally after a short background / foreground cycle. A PIN is required for every logged-in
 * user and is stored only on-device in the OS keystore.
 */
export interface IPinContext {
    /**
     * The current {@link PinState} of the app. Combined with the auth state, this determines
     * whether the user sees the PIN setup screen, the PIN entry (unlock) screen, or the main
     * app.
     */
    readonly pinState: Readonly<PinState>;

    /**
     * Stores a new PIN for the currently logged-in user and transitions the app to the unlocked
     * state. Used for both first-time setup and password-confirmed resets.
     */
    setPin(pin: string): Promise<void>;

    /**
     * Verifies the given PIN against what is stored on-device. Returns true if correct. On
     * success, the app transitions to the unlocked state. On failure, the failed-attempts
     * counter is incremented.
     */
    verifyPin(pin: string): Promise<boolean>;

    /**
     * Marks the app as locked, requiring the user to enter their PIN before continuing. Called
     * when the app goes to the background or the device locks.
     */
    lock(): void;

    /**
     * Abandons the current PIN-entry flow and forces a full password re-auth. Used by the
     * "Use password instead" fallback and after the attempt limit is hit.
     */
    fallbackToPassword(): Promise<void>;
}

export const PinContext = createContext<IPinContext>({
    pinState: { state: "unknown" },
    setPin: async () => {
        console.error("dummy PinContext shouldn't be used, but setPin was called");
    },
    verifyPin: async () => {
        console.error("dummy PinContext shouldn't be used, but verifyPin was called");
        return false;
    },
    lock: () => {
        console.error("dummy PinContext shouldn't be used, but lock was called");
    },
    fallbackToPassword: async () => {
        console.error("dummy PinContext shouldn't be used, but fallbackToPassword was called");
    },
});
