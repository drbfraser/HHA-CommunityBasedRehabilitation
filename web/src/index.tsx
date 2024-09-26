import { CssBaseline, ThemeProvider } from "@material-ui/core";
import React from "react";
import { createRoot } from "react-dom/client";
import { themeMui } from "theme.styles";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";

import App from "./App";
import { initializeCommon, KeyValStorageProvider } from "@cbr/common/init";
import { loginState } from "./util/hooks/loginState";
import { invalidateAllCachedAPI } from "@cbr/common/util/hooks/cachedAPI";
import { API_BASE_URL, API_URL } from "./util/api";
import { initI18n } from "@cbr/common/i18n.config";

const localStorageProvider: KeyValStorageProvider = {
    getItem: async (key: string) => {
        return window.localStorage.getItem(key);
    },
    setItem: async (key: string, value: string) => {
        window.localStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
        window.localStorage.removeItem(key);
    },
};

initializeCommon({
    apiUrl: API_URL,
    socketIOUrl: API_BASE_URL,
    keyValStorageProvider: localStorageProvider,
    useKeyValStorageForCachedAPIBackup: false,
    shouldLogoutOnTokenRefreshFailure: true,
    logoutCallback: async () => {
        loginState.emit(false);
        await invalidateAllCachedAPI("logout");
        window.location.replace("/");
    },
});

// why do we need to pass in initReactI18next?
initI18n(i18n, initReactI18next);

const renderApp = () => {
    const container = document.getElementById("root");
    if (!container) {
        console.error("No root element for app.");
        return;
    }

    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <ThemeProvider theme={themeMui}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </React.StrictMode>
    );
};

renderApp();
