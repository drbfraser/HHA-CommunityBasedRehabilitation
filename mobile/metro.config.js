const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project and workspace directories
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "..");
const config = getDefaultConfig(projectRoot);

// 1. Only watch the shared 'common' package NOT the entire monorepo.
//    Watching monorepoRoot caused Metro's file watcher to time out on windows
config.watchFolders = [path.resolve(monorepoRoot, "common")];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(monorepoRoot, "node_modules"),
];
module.exports = config;
