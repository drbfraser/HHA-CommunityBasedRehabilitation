const path = require("path");

class ShortPathBuilder {
    constructor({ rootDir }) {
        this._rootDir = rootDir;
    }

    buildPathForTestArtifact(artifactName, testSummary) {
        if (!testSummary) {
            return path.join(this._rootDir, artifactName);
        }
        const status = testSummary.status === "passed" ? "OK" : "FAIL";
        const title = (testSummary.title || "unknown")
            .replace(/[<>:"/\\|?*✗✓–]/g, "_")
            .slice(0, 80);

        const dirName = `${status}_${title}`;
        return path.join(this._rootDir, dirName, artifactName);
    }
}

module.exports = ShortPathBuilder;
