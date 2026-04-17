module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            [
                "module:react-native-dotenv",
                {
                    moduleName: "react-native-dotenv",
                    path: ".env",
                    safe: false,
                    allowUndefined: true,
                },
            ],
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            [
                "module-resolver",
                {
                    root: ["./"],
                    alias: {
                        "@/src": "./src",
                        "@": "./",
                    },
                    extensions: [".ios.ts", ".android.ts", ".ts", ".tsx", ".js", ".jsx", ".json"],
                },
            ],
            "react-native-reanimated/plugin",
        ],
    };
};
