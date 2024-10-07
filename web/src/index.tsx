import { CssBaseline, ThemeProvider, Theme, StyledEngineProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
import { themeMui } from "theme.styles";
import App from "./App";
import { initializeCommon, KeyValStorageProvider } from "@cbr/common/init";
import { loginState } from "./util/hooks/loginState";
import { invalidateAllCachedAPI } from "@cbr/common/util/hooks/cachedAPI";
import { API_BASE_URL, API_URL } from "./util/api";


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


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

ReactDOM.render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themeMui}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </StyledEngineProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
