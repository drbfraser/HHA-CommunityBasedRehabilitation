import * as SecureStore from "expo-secure-store";

export const PIN_MIN_LENGTH = 4;
export const PIN_MAX_LENGTH = 6;
export const PIN_MAX_ATTEMPTS = 5;

const pinStorageKey = (username: string) => `app_pin_${username}`;

export const isPinFormatValid = (pin: string): boolean => {
    if (pin.length < PIN_MIN_LENGTH || pin.length > PIN_MAX_LENGTH) {
        return false;
    }
    return /^\d+$/.test(pin);
};

export const hasPin = async (username: string): Promise<boolean> => {
    const stored = await SecureStore.getItemAsync(pinStorageKey(username));
    return stored !== null && stored.length > 0;
};

export const setPin = async (username: string, pin: string): Promise<void> => {
    if (!isPinFormatValid(pin)) {
        throw new Error("PIN must be 4-6 digits");
    }
    await SecureStore.setItemAsync(pinStorageKey(username), pin);
};

export const verifyPin = async (username: string, pin: string): Promise<boolean> => {
    const stored = await SecureStore.getItemAsync(pinStorageKey(username));
    return stored !== null && stored === pin;
};

export const clearPin = async (username: string): Promise<void> => {
    await SecureStore.deleteItemAsync(pinStorageKey(username));
};
