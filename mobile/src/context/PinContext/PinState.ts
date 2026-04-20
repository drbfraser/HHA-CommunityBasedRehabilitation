export namespace PinState {
    /**
     * Initial state while we determine if a PIN is set for the current user.
     */
    export interface Unknown {
        readonly state: "unknown";
    }

    /**
     * The user has no PIN stored on the device and must set one before using the app.
     */
    export interface NoPin {
        readonly state: "noPin";
    }

    /**
     * A PIN is set, the app is locked, and the user must enter their PIN (or fall back to
     * password) before accessing the app.
     */
    export interface Locked {
        readonly state: "locked";
        readonly failedAttempts: number;
    }

    /**
     * The PIN has been entered correctly (or just set) and the app is accessible.
     */
    export interface Unlocked {
        readonly state: "unlocked";
    }
}

export type PinState = PinState.Unknown | PinState.NoPin | PinState.Locked | PinState.Unlocked;
